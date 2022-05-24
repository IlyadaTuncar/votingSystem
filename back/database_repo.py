from datetime import *
import datetime
import psycopg2
def open_con():
	con = psycopg2.connect(
					host = "localhost",
					database="votesystemdb",
					user = "postgres",
 					password = "")
	return con


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
		option_vote_count = {'option_id': row[0],'title':row[1],'vote_count': row[2]}
		live_votes.append(option_vote_count)
	return live_votes

def db_get_all_polls():
	try:
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
	except: 
		return 'Fail'

def db_get_poll_by_id(pid):
	try:
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

		options = db_get_options_for_poll_id(pid)
		poll = format_row_to_poll(row, options)
		#return rows
		return poll
	except:
		return 'Fail'


def db_get_options_for_poll_id(poll_id):
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



def db_add_poll_and_options(poll):
	try:
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
		
		return 'Success'
	except:
		return 'Fail'

### Hvis denne metoden feiler blir det håndert i db_add_poll
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
	try:
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		select_sluttdato_query = f"select sluttdato from tbl_poll where id = {vote.get('poll_id')};"
		cur.execute(select_sluttdato_query)
		rowSluttsato = cur.fetchone()
		
		endDate = datetime.datetime.strptime(rowSluttsato[0], "%Y-%m-%d").strftime("%Y-%m-%d")
		today = date.today().strftime('%Y-%m-%d')
	
		if (today > endDate):
			raise PermissionError

		select_mail_query = f"select count(tbl_vote.email) from tbl_vote inner join tbl_option on tbl_option.id = tbl_vote.option_id where tbl_option.poll_id = {vote.get('poll_id')} and tbl_vote.email = '{vote.get('email')}';"
		cur.execute(select_mail_query)
		rowMail = cur.fetchone()
		if (rowMail[0]>0):
			raise ValueError

		vars = ( vote.get('option_id'), vote.get('email'))
		insert_query = "insert into TBL_VOTE (option_id, email) values (%s, %s)"
		
		cur.execute(insert_query, vars)
		#commit the query
		con.commit()
		#close the cursor and connection
		cur.close()
		con.close()
		return 'Success'
	except ValueError:
		return 'Existing mail'
	except PermissionError:
		return 'Poll outdated'
	except:
		return 'Fail'

### denne metoden kan slettes og trenger derfor ikke feil håndtering
def db_get_last_added_poll():
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

		options = db_get_options_for_poll_id(pid)
		poll = format_row_to_poll(row, options)
		#return rows
		return poll


def db_get_live_votes_for_poll(pid):
	try:
		con = open_con()
		cur = con.cursor()
		#execute query on poll table
		query = f"SELECT v1.option_id, tbl_option.option_title, number_of_votes FROM ( SELECT tbl_vote.option_id, count(tbl_vote.option_id) as number_of_votes FROM tbl_vote GROUP BY tbl_vote.option_id ) as v1 inner join tbl_option on tbl_option.id = v1.option_id where tbl_option.poll_id = {pid};"
		cur.execute(query)
		rows = cur.fetchall()
		#close the cursor
		cur.close()
		#close the connection
		con.close()
		live_votes = format_row_to_live_votes(rows)
		#return rows
		return live_votes
	except:
		return 'Fail'