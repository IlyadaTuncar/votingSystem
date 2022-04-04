#!flask/bin/python
from asyncore import poll
import sys
from flask import Flask, render_template, request, redirect, Response, send_from_directory, url_for, jsonify
import json
from database_repo import *

app = Flask(__name__,
			template_folder='../front/templates',
			static_url_path='',
			static_folder='../front/static',)

@app.route('/get_all_polls', methods = ['GET'])
def get_polls():
	data = db_get_all_polls()
	if(data=='Fail'):
		return jsonify('Kunne ikke hente avstemninger'), 404
	return jsonify(data)

### denne metoden kan slettes
@app.route('/get_polls', methods = ['GET'])
def get_options():
	#henter siste poll
	#dette skal endres i framtiden
	data = db_get_last_added_poll()
	if(data=='Fail'):
		return jsonify('Kunne ikke hente avstemning'), 404
	return jsonify(data)

@app.route('/get_poll/<id>', methods = ['GET'])
def get_poll(id):
	data = db_get_poll_by_id(id)
	if(data=='Fail'):
		return jsonify('Kunne ikke hente avstemning'), 404
	return jsonify(data)

@app.route('/opprettetPoll', methods = ['GET', 'POST'])
def serve_opprettet_poll():
	return render_template('opprettetPoll.html')

@app.route('/create_poll', methods = ['POST'])
def create_poll():
	request_data = request.json
	data = db_add_poll_and_options(request_data)
	if(data=='Success'):
		return jsonify('Poll er opprettet'), 201
	return jsonify('Kunne ikke opprette poll'), 400
	

@app.route('/', methods = ['GET','POST'])
def output():
	# serve index template
	return render_template('index.html')


@app.route('/admin', methods = ['GET', 'POST'])
def serve_admin():
	return render_template('adminside.html')


@app.route('/fan/<int:id>', methods = ['GET', 'POST'])
def serve_fan(id):
	return render_template('fanside.html', pid=id)

@app.route('/avsluttetPoll', methods = ['GET', 'POST'])
def serve_avsluttetPoll():
	return render_template('avsluttetPoll.html')

@app.route('/static/JS/<path:path>')
def send_js(path):
	return send_from_directory('JS', path)

@app.route('/newvote', methods = ['POST'])
def register_vote():
	# serve index template
 	# legg til i riktig vote
	request_data = request.json
	data = db_add_vote(request_data)
	if(data=='Existing mail'):
		return jsonify('Denne mail addressen har allerede stemt'), 400
	if(data=='Success'):
		return jsonify('Stemmen din ble registrert. Takk for din stemme!'), 201
	if(data=='Poll outdated'):
		return jsonify('Stemmingen er desverre avsluttet'), 400
	return jsonify('Kunne ikke lagre stemme'), 400
	

@app.route('/live_votes/<poll_id>', methods = ['GET'])
def send_live_votes(poll_id):
	data = db_get_live_votes_for_poll(poll_id)
	if(data=='Fail'):
		return jsonify('Kunne ikke opprette poll'), 400
	return jsonify(data), 200

if __name__ == '__main__':
	# run!
	app.run(debug=True)