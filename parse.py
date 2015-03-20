#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
import urllib2
from bs4 import BeautifulSoup

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

data = {}
pages = read_json('urls.json')
for page, url in pages.iteritems():
    html_doc = urllib2.urlopen(url).read()
    soup = BeautifulSoup(html_doc)
    print soup.title
    td = soup.select(".DataTable3 tr td")[4]
    percentage = td.string[:-1]
    data[page] = percentage

write_json('data.json', data)
