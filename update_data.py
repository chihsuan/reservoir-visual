#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import ssl
import time
import urllib.request
import sys

# The WRA server certificate is missing a Subject Key Identifier, which the
# VERIFY_X509_STRICT flag (enabled by default in Python 3.13+) rejects, even
# though curl connects fine. Disable only the strict RFC 5280 checks while
# keeping CA chain and hostname verification — TLS is NOT turned off.
SSL_CONTEXT = ssl.create_default_context()
SSL_CONTEXT.verify_flags &= ~ssl.VERIFY_X509_STRICT

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

# Public JSON API used by the WRA fhyv2 frontend.
# The old scraper (chihsuan/TaiwanReservoirAPI) parsed ReservoirPage_2011/StorageCapacity.aspx,
# which broke when the site migrated to https://fhy.wra.gov.tw/fhyv2/monitor/reservoir.
# We now call the new API directly. The apikey is taken from the fhyv2 frontend bundle
# (app.js); if it ever stops working, grab the current value from that page's app.js again.
API_KEY = 'd6dd3cd4-493f-43a3-92b1-8b2db217da96'

# StationNo <-> Chinese reservoir name mapping
STATION_URL = 'https://fhy.wra.gov.tw/Api/v2/Reservoir/Station'
# Real-time: effective storage / percentage / observation time
REALTIME_URL = 'https://fhy.wra.gov.tw/Api/v2/Reservoir/Info/RealTime'
# Daily totals: inflow / outflow
DAILY_URL = 'https://fhy.wra.gov.tw/OpenApiv3/v2/Reservoir/Daily'


def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)


def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4, ensure_ascii=False)


def fetch_api(url, retries=3, delay=5):
    """Call a WRA API endpoint and return a dict keyed by StationNo."""
    req = urllib.request.Request(url, headers={'apikey': API_KEY})
    for attempt in range(retries):
        try:
            response = urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT)
            payload = json.loads(response.read().decode('utf-8'))
            data = payload.get('Data')
            if data:
                return {item['StationNo']: item for item in data}
        except Exception as exc:
            print(f"Error fetching {url}: {exc}")
        print(f"No valid data from {url}, retrying ({attempt + 1}/{retries})...")
        time.sleep(delay)
    print(f"Failed to get valid data from {url}")
    sys.exit(1)


def format_update_time(iso_time):
    """'2026-06-19T09:00:00' -> '2026-06-19(09時)', matching the original display format."""
    if not iso_time or 'T' not in iso_time:
        return iso_time
    date_part, time_part = iso_time.split('T')
    hour = time_part.split(':')[0]
    return f"{date_part}({hour}時)"


def to_str(value, decimals=2):
    return f"{float(value):.{decimals}f}"


data = read_json('data/data.json')

stations = fetch_api(STATION_URL)
realtime = fetch_api(REALTIME_URL)
daily = fetch_api(DAILY_URL)

# Chinese reservoir name -> StationNo
name_to_no = {s['StationName']: no for no, s in stations.items()}

for name, reservoir in data.items():
    station_no = name_to_no.get(name)
    if station_no is None:
        print(f"[skip] {name}: no matching station number in Station API")
        continue

    rt = realtime.get(station_no)
    dy = daily.get(station_no)

    # Real-time: storage / percentage / observation time
    if rt and rt.get('EffectiveStorage') is not None:
        print(name, reservoir['id'], rt.get('Time'))
        reservoir['volumn'] = to_str(rt['EffectiveStorage'])
        reservoir['updateAt'] = format_update_time(rt.get('Time'))
        if rt.get('EffectiveCapacity'):
            reservoir['baseAvailable'] = to_str(rt['EffectiveCapacity'])
        if rt.get('PercentageOfStorage') is not None:
            reservoir['percentage'] = round(float(rt['PercentageOfStorage']), 2)
        elif reservoir.get('baseAvailable'):
            reservoir['percentage'] = round(
                float(reservoir['volumn']) / float(reservoir['baseAvailable']) * 100, 2)

    # Daily inflow/outflow totals -> netflow (same formula as before: outflow - inflow)
    if dy and dy.get('InflowTotal') is not None and dy.get('OutflowTotal') is not None:
        reservoir['daliyInflow'] = to_str(dy['InflowTotal'])
        reservoir['daliyOverflow'] = to_str(dy['OutflowTotal'])
        reservoir['daliyNetflow'] = round(
            float(dy['OutflowTotal']) - float(dy['InflowTotal']), 2)
    else:
        reservoir['daliyNetflow'] = '--'

write_json('data/data.json', data)
print('done')
