from http import client
from select import select
from turtle import title
import psycopg2
def open_con():
	con = psycopg2.connect(
					host = "localhost",
					database="votesystemdb",
					user = "postgres",
 					password = "")
	return con
 #get metoder for poll

def get_all_polls():
		#cursor 
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		cur.execute("select * from TBL_POLL")
		rows = cur.fetchall()
		#close the cursor
		cur.close()
		#close the connection
		con.close()
		#return rows
		return rows

def get_poll_by_id(id):
		#cursor 
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		query = f"SELECT * FROM TBL_POLL WHERE id = {id};"
		cur.execute(query)
		rows = cur.fetchall()
		#close the cursor
		cur.close()
		#close the connection
		con.close()
		#return rows
		return rows

 #get metoder for option
def get_all_options():
		#cursor 
		con = open_con()
		cur = con.cursor()
		cur.execute("select * from TBL_OPTION")
		rows = cur.fetchall()

		cur.close()
		con.close()
		return rows

def get_options_for_poll_id(poll_id):
	#cursor 
	con = open_con()
	cur = con.cursor()
	#execute query on poll table
	query = f"SELECT * FROM TBL_OPTION WHERE poll_id = {poll_id};"
	cur.execute(query)
	rows = cur.fetchall()
	#close the cursor
	cur.close()
	#close the connection
	con.close()
	#return rows
	return rows


###########################
#håndter feilmeldinger så programmet ikke krasjenr
###########################
def db_add_poll_and_options(poll):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table

	vars = ( poll.get('client_id'), poll.get('title'), poll.get('pollBeskrivelse'), poll.get('pollSluttDato'))
	insert_query = "insert into TBL_POLL (client_id, poll_title, poll_description, sluttdato) values (%s, %s, %s, %s) RETURNING id;"
	
	cur.execute(insert_query, vars)
	rows = cur.fetchall()
	#commit the query
	con.commit()
	#close the cursor and connection
	cur.close()
	con.close()

	for o in poll.get('options'):
		db_add_opption(poll.get('client_id'), o)
	
	return rows

def db_add_opption(poll_id, option):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table

	vars = ( poll_id, option.get('title'), option.get('video_url'), option.get('dato'), option.get('scorer'), option.get('scorerlag'), option.get('motstander'), option.get('thumbnail'))
	insert_query = "insert into TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url) values (%s, %s, %s, %s, %s, %s, %s, %s)"
	
	cur.execute(insert_query, vars)
	#commit the query
	con.commit()
	#close the cursor and connection
	cur.close()
	con.close()
	return
