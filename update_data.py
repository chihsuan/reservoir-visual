#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import time
import urllib.request
import sys

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4, ensure_ascii=False)

def fetch_json(url, retries=3, delay=5):
    for attempt in range(retries):
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        if 'data' in data:
            return data
        print(f"No 'data' key in response from {url}, retrying ({attempt + 1}/{retries})...")
        time.sleep(delay)
    print(f"Failed to get valid data from {url}")
    sys.exit(1)

api = 'http://127.0.0.1:10080/'
api_today = 'http://127.0.0.1:10080/today'

data = read_json('data/data.json')

new_data = fetch_json(api)

for name, reservoir in data.items():
    for reservoir_new in new_data['data']:
        if name == reservoir_new['reservoirName']:
            print(name, reservoir['id'])
            reservoir['daliyInflow'] = reservoir_new['daliyInflow']
            reservoir['daliyOverflow'] = reservoir_new['daliyOverflow']
            if reservoir_new['baseAvailable'] != '--':
                reservoir['baseAvailable'] = reservoir_new['baseAvailable'].replace(',', '')
            try:
                reservoir['daliyNetflow'] = float(reservoir_new['daliyOverflow']) - \
                        float(reservoir_new['daliyInflow'])
                print(reservoir['daliyNetflow'])
            except:
                reservoir['daliyNetflow'] = '--'

new_data = fetch_json(api_today)

for name, reservoir in data.items():
    for reservoir_new in new_data['data']:
        if name == reservoir_new['reservoirName']:
            print(name, reservoir['id'], reservoir_new['immediateTime'])
            if reservoir_new['immediateStorage'] != '--':
                reservoir['updateAt'] = reservoir_new['immediateTime']
                reservoir['volumn'] = reservoir_new['immediateStorage'].replace(',', '')
                if reservoir_new['immediatePercentage'] == '--':
                    reservoir['percentage'] = (float(reservoir['volumn']) /
                            float(reservoir['baseAvailable'])) * 100
                elif len(reservoir_new['immediatePercentage']) == 6:
                    reservoir['percentage'] = float(reservoir_new['immediatePercentage'][:-2])
                else:
                    reservoir['percentage'] = float(reservoir_new['immediatePercentage'][:-1])
            else:
                reservoir['percentage'] = float(reservoir['percentage'])

write_json('data/data.json', data)
