#!flask/bin/python
from asyncore import poll
import sys
import requests
from flask import Flask, render_template, request, redirect, Response, send_from_directory, url_for, jsonify
import json

app = Flask(__name__,
			template_folder='../front/templates',
			static_url_path='', 
            static_folder='../front/static',)

polls = []

@app.route('/get_polls', methods = ['GET'])
def get_options():
	data = polls
	print(polls)
	return jsonify(data)

@app.route('/get_poll/<id>', methods = ['GET'])
def get_poll(id):
	try:
		indeks = int(id)
		data = polls[indeks]
		return jsonify(data)
	except:
		return "Poll not found"

@app.route('/create_poll', methods = ['POST'])
def create_poll():
	request_data = request.json
	polls.append(request_data)
	return ""


@app.route('/', methods = ['GET','POST'])
def output():
    # serve index template
	return render_template('index.html')


@app.route('/admin', methods = ['GET', 'POST'])
def serve_admin():
    return render_template('adminside.html')


@app.route('/fan', methods = ['GET', 'POST'])
def serve_fan():
    return render_template('fanside.html')


'''@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')
'''

@app.route('/static/JS/<path:path>')
def send_js(path):
    return send_from_directory('JS', path)

if __name__ == '__main__':
    # run!
    app.run(debug=True)