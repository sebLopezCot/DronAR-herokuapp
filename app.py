from flask import Flask
from flask import request
from urlparse import urlparse
import requests
import json
import urllib2
from urllib2 import urlopen
from cookielib import CookieJar
app = Flask(__name__)

def check_if_empty(elements):
	if len(elements) < 1:
		return ''
	else:
		return elements[0]

@app.route("/", methods=['GET'])
def index():
	if request.method == 'GET':
		# Get incoming image url to reverse lookup
		return 'G.G.nore'



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True)
