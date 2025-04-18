from flask import Flask, render_template, request, redirect, url_for, session, jsonify, make_response
import mysql.connector
import re
import json
import sys
import traceback
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app,resources={r"*": {"origins": "*"}})

app.secret_key = 'your secret key' #!!! see if this is decided on earlier in tutorial

#app.config['MYSQL_HOST'] = 'flask-api:5000'
app.config['MYSQL_HOST'] = 'localhost' #'host.docker.internal'
#package.json changed from "proxy": "http://flask-api:5000",
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ""
app.config['MYSQL_DB'] = 'users'#'user_accts'
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

""""@app.before_request()
def handle_preflight():
	if request.method == "OPTIONS":
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
		response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
		return response
"""

def get_connection():
	config = {
		'host': 'mysql',
		'user': 'root',
		'password': 'MYsqldocker1Pass2',
		'database': 'dockerusers2-mysql',
		'port': '3306',
	}
	connection = mysql.connector.connect(**config)
	return connection

@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin()
def main():
	return "OK", 200

@app.route('/login', methods=['GET', 'POST'])
def login():
	connection = get_connection()
	msg = ''
	if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
		username = request.form['username']
		password = request.form['password']
		cursor = connection.cursor()
		cursor.execute(
			'SELECT * FROM user_accts WHERE username = %s \
			AND password = %s', (username, password, ))
		account = cursor.fetchone()
		if account:
			session['loggedin'] = True
			session['id'] = account[0]
			#session['id'] = account['id']
			session['username'] = account[1]
			#session['username'] = account['username']
			msg = 'Logged in successfully!'
			return render_template('index.html', msg=msg)
		else:
			msg = 'Incorrect username or password!'
	connection.close()
	return render_template('login.html', msg=msg)


@app.route('/logout')
def logout():
	session.pop('loggedin', None)
	session.pop('id', None)
	session.pop('username', None)
	return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
	connection = get_connection()
	msg = ''
	if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form and 'address' in request.form and 'city' in request.form and 'country' in request.form and 'postalcode' in request.form and 'organization' in request.form:
		username = request.form['username']
		password = request.form['password']
		email = request.form['email']
		organization = request.form['organization']
		address = request.form['address']
		if 'city' in request.form:
			city = request.form['city']
		else:
			city = ''
		if 'state' in request.form:
			state = request.form['state']
		else:
			state = ''
		country = request.form['country']
		postalcode = request.form['postalcode']
		cursor = connection.cursor()
		cursor.execute(
			'SELECT * FROM accounts WHERE username = %s', (username, ))
		account = cursor.fetchone()
		if account:
			msg = 'Account already exists!'
		elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
			msg = 'Invalid email address!'
		elif not re.match(r'[A-Za-z0-9]+', username):
			msg = 'Name may only contain characters and numbers!'
		else:
			cursor.execute('INSERT INTO user_accts (username, password, email, organization, address, city, state, country, postalcode) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)', (username, password, email, organization, address, city, state, country, postalcode))

			connection.commit()
			"""
			cursor.execute('INSERT INTO accounts VALUES \
			(NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (username, password, email, organization, address, city, state, country, postalcode, ))
			"""
			msg = 'You have successfully registered!'
	elif request.method == 'POST':
		msg = 'Please fill out the form!'
	connection.close()
	return render_template('register.html', msg=msg)


@app.route("/index")
def index():
	if 'loggedin' in session:
		return render_template("index.html")
	return redirect(url_for('login'))


@app.route("/display")
def display():
	connection = get_connection()
	if 'loggedin' in session:
		cursor = connection.cursor()
		cursor.execute('SELECT * FROM user_accts WHERE id = %s',
			(session['id'], ))
		#SELECT * FROM accounts WHERE id = %s, and session['id'] instead
		account = cursor.fetchone()
		return render_template("display.html", account=account)
	else:
		return "Not logged in\n"
	connection.close()
	return
	#return redirect(url_for('login'))


@app.route("/userlist", methods=['GET'])
def userlist():
	try:
		connection = get_connection()
		cursor = connection.cursor()
		#cursor.execute('SELECT id, username FROM user_accts WHERE id is NOT NULL')
		cursor.execute('SELECT * FROM user_accts WHERE id is NOT NULL')
		all_cursor = cursor.fetchall()
		all_accts = cursor.description #is this necessary?

		columns = []
		for i in all_accts:
			columns.append(i[0])

		jsondata = []
		for n in all_cursor:
			temp = {}
			for z in range(len(columns)):
				temp[columns[z]] = n[z]
			jsondata.append(temp)
		connection.close()
		return jsonify(jsondata)
	except Exception as e:
		print(str(traceback.format_exc()), file=sys.stderr)
		return jsonify(str(traceback.format_exc())), 500

#saveuserdetails route

@app.route("/saveUserDetails/", methods=['GET', 'POST', 'OPTIONS'])
def saveUserDetails():
	print("in flask saveuserdetails")
	if request.method == 'OPTIONS':
		print("request.method was options")
		return "OK", 200
	msg = 'no msg'
	print("l196")
	print(dir(request))
	print('raw data:', request.json)
	print('data:', (request.json))
	print('is_json:', request.is_json)
	#data = request.json #data = request.get_json()
	reqdata = request.json
	print('l205')
	user_id = int(reqdata.get('id')) #data.get('id') #user_id = data['id']
	email = reqdata.get('email')
	org = reqdata.get('organization')
	address = reqdata.get('address')
	city = reqdata.get('city')
	locstate = reqdata.get('state')
	country = reqdata.get('country')
	postal = reqdata.get('postalcode')
	print("id: " + str(user_id) + " email: " + str(email) + " org: " + str(org) + " address: " + str(address) + " city: " + str(city) + " state: " + str(locstate) + " country: " + str(country) + " postalcode: " + str(postal))

	if request.method == 'POST' and user_id:
		print("181")
		print(str(request.form))
		connection = get_connection()
		cursor1 = connection.cursor()

		#where are we getting id info from?
		cursor1.execute('SELECT * FROM user_accts WHERE id=%s', [user_id])
		account = cursor1.fetchone()
		print(account)
		print("217")
		#check if this update statement is formatted correctly
		cursor2 = connection.cursor()
		#cursor2.execute(f"UPDATE user_accts SET {info_type}={info} WHERE id={user_id}")
		#cursor2.execute('''UPDATE user_accts SET %s=%s WHERE id=%s''' % (info_type, info, user_id))
		execute_stmnt = "UPDATE user_accts SET email='%s', organization='%s', address='%s', city='%s', state='%s', country='%s', postalcode='%s' WHERE id=%s" % (email, org, address, city, locstate, country, postal, user_id)
		#execute_stmnt = "UPDATE user_accts SET %s='%s' WHERE id=%s" % (info_type, info, user_id)
		print(execute_stmnt)
		cursor2.execute(execute_stmnt)
		#cursor2.execute("UPDATE user_accts SET %s=%s WHERE id=%s" % (info_type, info, user_id))
		connection.commit()
		cursor3 = connection.cursor()
		cursor3.execute('SELECT * FROM user_accts WHERE id=%s', [user_id])
		account = cursor3.fetchone()
		print(account)
		connection.close()
		msg = 'Information successfully updated'
		return jsonify(account)
	print("returning")
	return msg


@app.route("/addNewUser/", methods=['GET', 'POST', 'OPTIONS'])
def addNewUser():
	print("in flask addnewuser")
	if request.method == 'OPTIONS':
		print("request.method was options")
		return "OK", 200
	msg = 'no msg'
	reqdata = request.json
	user = reqdata.get('username')
	passw = reqdata.get('password')
	email = reqdata.get('email')
	org = reqdata.get('organization')
	address = reqdata.get('address')
	city = reqdata.get('city')
	locstate = reqdata.get('state')
	country = reqdata.get('country')
	postal = reqdata.get('postalcode')
	print("user: " + str(user) + " pass: " + str(passw) + " email: " + str(email) + " org: " + str(org) + " address: " + str(address) + " city: " + str(city) + " state: " + str(locstate) + " country: " + str(country) + " postalcode: " + str(postal))

	if request.method == 'POST' and email:
		execute_stmnt = "INSERT INTO user_accts (username, password, email, organization, address, city, state, country, postalcode) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')" % (user, passw, email, org, address, city, locstate, country, postal)
		print(execute_stmnt)
		connection = get_connection()
		cursor1 = connection.cursor()
		cursor1.execute(execute_stmnt)
		connection.commit()
		connection.close()
		msg = "Information successfully updated"
	print("returning")
	return msg


#/userlist/<id> [GET]
#Localhost:3000/getUserDetail/5
@app.route("/userDetails/<id>", methods=['GET'])
def userDetails(id):
	connection = get_connection()
	cursor = connection.cursor()
	print(id)
	cursor.execute('SELECT username, email, organization, address, city, state, country, postalcode FROM user_accts WHERE id=%s', (id, ))
	all_cursor = cursor.fetchall()
	all_accts = cursor.description  # is this necessary?

	columns = []
	for i in all_accts:
		columns.append(i[0])

	jsondata = []
	for n in all_cursor:
		temp = {}
		for z in range(len(columns)):
			temp[columns[z]] = n[z]
		jsondata.append(temp)
	connection.close()
	print(jsondata)
	return jsonify(jsondata)



@app.route("/update", methods=['GET', 'POST'])
def update():
	msg = ''
	connection = get_connection()
	if 'loggedin' in session:
		if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form and 'address' in request.form and 'city' in request.form and 'country' in request.form and 'postalcode' in request.form and 'organization' in request.form:
			username = request.form['username']
			password = request.form['password']
			email = request.form['email']
			organization = request.form['organization']
			address = request.form['address']
			if 'city' in request.form:
				city = request.form['city']
			else:
				city = ''
			if 'state' in request.form:
				state = request.form['state']
			else:
				state = ''
			country = request.form['country']
			postalcode = request.form['postalcode']
			cursor = connection.cursor()
			cursor.execute(
				'SELECT * FROM user_accts WHERE username = %s', (username, ))
			account = cursor.fetchone()
			if account:
				msg = 'Account already exists!'
			elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
				msg = 'Invalid email address!'
			elif not re.match(r'[A-Za-z0-9]+', username):
				msg = 'Name may only contain characters and numbers!'
			else:
				cursor.execute('UPDATE user_accts SET username = %s, password = %s, email = %s, organization = %s, \
					address = %s, city = %s, state = %s, \
					country = %s, postalcode = %s, WHERE id = %s', (
						username, password, email, organization, address, city, state, country, postalcode, (session['id']), ))
				#UPDATE accounts SET username...WHERE id
				connection.commit()
				msg = 'You have successfully updated your account information!'
		elif request.method == 'POST':
			msg = 'Please fill out the form!'
		return render_template("update.html", msg=msg)
	connection.close()
	return redirect(url_for('login'))


if __name__ == "__main__":
	app.run()

#if __name__ == "__main__":
	#app.run(host="localhost", port=int("5000"))