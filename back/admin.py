#!flask/bin/python
import sys
from flask import Flask, render_template, request, redirect, Response, send_from_directory
import random, json

app = Flask(__name__, 
			template_folder='../front/templates', 
			static_url_path='', 
			static_folder='../front/static')


@app.route('/')
def output():
    # serve index template
    return render_template('index.html', name='Joe')

@app.route('/static/JS/<path:path>')
def send_js(path):
    return send_from_directory('JS', path)

if __name__ == '__main__':
    # run!
    app.run(debug=True)