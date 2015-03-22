#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
import urllib2
from bs4 import BeautifulSoup
base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

data = {}
pages = read_json('urls.json')
canner = read_json('canner.json')
for page, url in pages.iteritems():
    html_doc = urllib2.urlopen(url).read()
    soup = BeautifulSoup(html_doc)
    print soup.title
    td = soup.select(".DataTable3 tr td")
    name = soup.title.text.split("\r\n")[0]
    percentage = td[4].string[:-2]
    volumn = td[3].string
    update_at = td[0].string
    data[page] = {"name": name, "updateAt": update_at, "volumn": volumn, "percentage": percentage}
    for reservoir in canner["data"]["reservoirs"]:
        if reservoir['id'] == page:
            reservoir['name'] = name
            reservoir['percentage'] = percentage
            reservoir['volumn'] = volumn
            reservoir['updateAt'] = update_at

write_json('data/data.json', data)
write_json('./canner.json', canner)
