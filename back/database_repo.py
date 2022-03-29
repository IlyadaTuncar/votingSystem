from http import client
from select import select
from turtle import title
import psycopg2
def open_con():
	con = psycopg2.connect(
					host = "localhost",
					database="votesystemdb",
					user = "postgres",
 					password = "derfor32")
	return con
 #get metoder for poll

def format_row_to_poll(row, options):
	poll = {'id': row[0], "client_id" : row[1], "title": row[2], "poll_description": row[3], "pollSluttDato": row[4], "options": options}
	return poll

def format_row_to_options(rows):
	options = []
	for row in rows:
		option = {'id': row[0],'poll_id':row[1], 'title': row[2], 'video_url': row[3], 'dato': row[4], 'scorer': row[5], 'scorerlag': row[6], 'motstander': row[7], 'thumbnail_url': row[8]}
		options.append(option)
	return options

def format_row_to_live_votes(rows):
	live_votes = []
	for row in rows:
		option_vote_count = {'option_id': row[0], 'vote_count': row[1]}
		live_votes.append(option_vote_count)
	return live_votes

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

def get_poll_by_id(pid):
		#cursor 
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		query = f"SELECT * FROM TBL_POLL WHERE id = {pid};"
		cur.execute(query)
		row = cur.fetchone()
		#close the cursor
		cur.close()
		#close the connection
		con.close()

		options = get_options_for_poll_id(pid)
		poll = format_row_to_poll(row, options)
		#return rows
		return poll

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
	options = format_row_to_options(rows)
	#return rows
	return options


###########################
#håndter feilmeldinger så programmet ikke krasjenr
###########################
def db_add_poll_and_options(poll):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table

	vars = ( poll.get('client_id'), poll.get('title'), poll.get('poll_description'), poll.get('pollSluttDato'))
	insert_query = "insert into TBL_POLL (client_id, poll_title, poll_description, sluttdato) values (%s, %s, %s, %s) RETURNING id;"
	
	cur.execute(insert_query, vars)
	pid = cur.fetchone()
	#commit the query
	con.commit()
	#close the cursor and connection
	cur.close()
	con.close()

	for o in poll.get('options'):
		db_add_opption(pid, o)
	
	return pid

def db_add_opption(poll_id, option):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table

	vars = ( poll_id, option.get('title'), option.get('video_url'), option.get('dato'), option.get('scorer'), option.get('scorerlag'), option.get('motstander'), option.get('thumbnail_url'))
	insert_query = "insert into TBL_OPTION (poll_id, option_title, video_url, dato, scorer, scorerlag, motstander, thumbnail_url) values (%s, %s, %s, %s, %s, %s, %s, %s)"
	
	cur.execute(insert_query, vars)
	#commit the query
	con.commit()
	#close the cursor and connection
	cur.close()
	con.close()
	return


def db_add_vote(vote):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table

	vars = ( vote.get('option_id'), vote.get('email'))
	insert_query = "insert into TBL_VOTE (option_id, email) values (%s, %s)"
	
	cur.execute(insert_query, vars)
	#commit the query
	con.commit()
	#close the cursor and connection
	cur.close()
	con.close()
	return


def get_last_added_poll():
		#cursor 
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		query = f"SELECT * FROM TBL_POLL WHERE id = (SELECT MAX(id) FROM TBL_POLL);"
		cur.execute(query)
		row = cur.fetchone()
		pid = row[0]
		#close the cursor
		cur.close()
		#close the connection
		con.close()

		options = get_options_for_poll_id(pid)
		poll = format_row_to_poll(row, options)
		#return rows
		return poll


def db_get_live_votes_for_poll(pid):
	con = open_con()
	cur = con.cursor()
	#execute query on poll table
	query = f"select tbl_vote.option_id, count(tbl_vote.option_id) as number_of_votes from tbl_vote inner join tbl_option on tbl_option.id = tbl_vote.option_id where tbl_option.poll_id = {pid} group by tbl_vote.option_id;"
	cur.execute(query)
	rows = cur.fetchall()
	#close the cursor
	cur.close()
	#close the connection
	con.close()
	live_votes = format_row_to_live_votes(rows)
	#return rows
	return live_votes