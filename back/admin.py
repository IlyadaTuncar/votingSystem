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
	data = get_all_polls()
	return jsonify(data)

@app.route('/get_polls', methods = ['GET'])
def get_options():
	#henter siste poll
	#dette skal endres i framtiden
	data = get_last_added_poll()
	return jsonify(data)

@app.route('/get_poll/<id>', methods = ['GET'])
def get_poll(id):
	try:
		data = get_poll_by_id(id)
		return jsonify(data)
	except:
		return "Poll not found"

@app.route('/opprettetPoll', methods = ['GET', 'POST'])
def serve_opprettet_poll():
	return render_template('opprettetPoll.html')

@app.route('/create_poll', methods = ['POST'])
def create_poll():
	request_data = request.json
	db_add_poll_and_options(request_data)
	success = True
	if(success):
		return jsonify("Poll er opprettet")
	else:
		return "Kunne ikke opprette poll"


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
	db_add_vote(request_data)
	success = True
	if(success):
		return jsonify("Stemme er registrert")
	else:
		return "Kunne ikke registrere stemme"	


@app.route('/live_votes/<poll_id>', methods = ['GET'])
def send_live_votes(poll_id):
	live_votes = db_get_live_votes_for_poll(poll_id)
	return jsonify(live_votes)

if __name__ == '__main__':
	# run!
	app.run(debug=True)