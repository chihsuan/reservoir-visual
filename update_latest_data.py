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

data = read_json('data/data.json')
pages = read_json('urls.json')

for page, url in pages.iteritems():
    html_doc = urllib2.urlopen(url).read()
    soup = BeautifulSoup(html_doc)
    td = soup.select(".DataTable3 tr td")
    name = soup.title.text.split("\r\n")[0]
    percentage = td[4].string[:-1]
    volumn = td[3].string
    update_at = td[0].string
    if name in data:
        data[name]['percentage'] = percentage
        data[name]['volumn'] = volumn
        time = update_at.split(' ')
        data[name]['updateAt'] = '{0} ({1}時)'.format(time[0], int(time[1].split(':')[0]))
        print data[name]
    print name

write_json('data/data.json', data)
