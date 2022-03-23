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
