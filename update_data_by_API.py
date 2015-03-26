#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
import urllib2
import sys

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

#api = 'http://127.0.0.1:10080/'
api_today = 'http://127.0.0.1:10080/today'
api = 'http://128.199.223.114:10080/'

data = read_json('data/data.json')

response = urllib2.urlopen(api);
try:
    new_data = json.loads(response.read())
except e:
    print e
    sys.exit(1)

for name, reservoir in data.iteritems():
    for reservoir_new in new_data['data']:
        if name == reservoir_new['reservoirName']:
            print name, reservoir['id']
            reservoir['daliyInflow'] = reservoir_new['daliyInflow']
            reservoir['daliyOverflow'] = reservoir_new['daliyOverflow']
            if reservoir_new['baseAvailable'] != '--':
                reservoir['baseAvailable'] = reservoir_new['baseAvailable'].replace(',', '')
            try:
                reservoir['daliyNetflow'] = float(reservoir_new['daliyOverflow']) -\
                        float(reservoir_new['daliyInflow'])
            except:
                reservoir['daliyNetflow'] = '--'

response = urllib2.urlopen(api_today);
try:
    new_data = json.loads(response.read())
except e:
    print e
    sys.exit(1)

for name, reservoir in data.iteritems():
    for reservoir_new in new_data['data']:
        if name == reservoir_new['reservoirName']:
            print name, reservoir['id'], reservoir_new['immediateTime']
            if reservoir_new['immediateStorage'] != '--':
                reservoir['updateAt'] = reservoir_new['immediateTime']
                reservoir['volumn'] = reservoir_new['immediateStorage'].replace(',', '')
                if reservoir_new['immediatePercentage'] == '--':
                    reservoir['percentage'] = (float(reservoir['volumn']) / \
                            float(reservoir['baseAvailable'])) * 100
                else:
                    reservoir['percentage'] = float(reservoir_new['immediatePercentage'][:-2])
            else:
                reservoir['percentage'] = float(reservoir['percentage'])

write_json('data/data.json', data)
