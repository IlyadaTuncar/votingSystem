#!flask/bin/python
import sys
import json
from flask import Flask, render_template, request, redirect, Response, send_from_directory, url_for, jsonify
import random, json

app = Flask(__name__,
			template_folder='../front/templates',
			static_url_path='', 
            static_folder='../front/static',)

polls = []
for x in range(3):

	options = [
		{
		"video_url":"https://api.forzasys.com/eliteserien/playlist.m3u8/2966:5001000:5036000/Manifest.m3u8",
		"video_text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"
			},
		{
		"video_url":"https://api.forzasys.com/eliteserien/playlist.m3u8/2966:5399000:5434000/Manifest.m3u8"
			},
		{
		"video_url":"https://api.forzasys.com/eliteserien/playlist.m3u8/2962:6340000:6375000/Manifest.m3u8"
		}
		]

	polls.append({
  		"poll_id": x,
  		"poll_description": "This is a poll",
 		"options": options
		})

@app.route('/get_options', methods = ['GET'])
def get_options():
    # serve index template
	#testing
	data = polls[1]
	return jsonify(data)


@app.route('/create_poll', methods = ['POST'])
def create_poll():
	request_data = request.get_json()
	print(request_data)
	return "rar return"


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