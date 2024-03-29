import sqlite3
import json
from flask import Flask, request, jsonify
import os
from datetime import datetime, timedelta
import secrets

app = Flask(__name__)
db = None
cursor = None

# The config version is the version name as inside the config.rs in the game source code
@app.route('/api/<version>/config', methods=['GET'])
def get_config(version):
	print(version)
	if os.path.exists(f'backend/config/config_{version}.json'):
		print("path exists")
		with open(f'backend/config/config_{version}.json', 'r') as f:
			config = json.load(f)
		return jsonify(config), 200
	else:
		return jsonify({'error': f'No config for this version'}), 404

@app.route('/api/user', methods=['POST'])
def get_users():
	data = request.get_json()
	user_uuid = data.get('uuid') 
	if user_uuid is None:
		return jsonify({'error': 'You are not logged in!'}), 400
	cursor.execute('SELECT * FROM users WHERE uuid = ?', (user_uuid,))
	users = cursor.fetchone()
	return jsonify(users)

@app.route('/api/units', methods=['POST'])
def get_units():
	data = request.get_json()
	session = data.get('session') 
	if session is None:
		return jsonify({'error': 'You are not logged in!'}), 400
	cursor.execute('SELECT * FROM sessions WHERE token = ?', (session,))
	session = cursor.fetchone()
	if session is None:
		return jsonify({'error': 'Invalid session'}), 401

	cursor.execute('SELECT user_id FROM sessions WHERE token = ?', (session,))
	user_id = cursor.fetchone()
	if not user_id:
		print("user id error")

	cursor.execute('SELECT user FROM users WHERE user_id = ?', (user_id,))
	user_uuid = cursor.fetchone()

	cursor.execute('SELECT * FROM units WHERE owner_uuid = ?', (user_uuid,))
	units = cursor.fetchall()
	return jsonify(units)

@app.route('/api/signin', methods=['POST'])
def signin():
	data = request.get_json()
	username = data.get('username')
	pass_hash = data.get('password')
	if username is None or pass_hash is None:
		return jsonify({'error': 'Missing username or password'}), 400
	cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, pass_hash))
	user = cursor.fetchone()
	if user is None:
		return jsonify({'error': 'Invalid username or password'}), 401
	res = {
		"session": secrets.token_hex(16),
		"expires_at": datetime.now() + timedelta(hours=1),
	}
	cursor.execute('INSERT INTO sessions (user_id, token, created_at, updated_at, expires_at) VALUES (?, ?, ?, ?, ?)', (user[0], res["session"], datetime.now(), datetime.now(), datetime.now() + timedelta(hours=1)))
	db.commit()
	return jsonify(res)

@app.route('/api/signup', methods=['POST'])
def signup():
	data = request.get_json()
	username = data.get('username')
	pass_hash = data.get('password')
	if username is None or pass_hash is None:
		return jsonify({'error': 'Missing username or password'}), 400
	cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
	user = cursor.fetchone()
	if user is not None:
		return jsonify({'error': 'Username already exists'}), 400
	cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, pass_hash))
	db.commit()
	return jsonify({'message': 'User created'}), 201

if __name__ == "__main__":
    db = sqlite3.connect('backend/database.db')
    cursor = db.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, username TEXT, password TEXT, uuid TEXT)''')
    db.commit()
    cursor.execute('''CREATE TABLE IF NOT EXISTS units (unit_id INTEGER PRIMARY KEY, name TEXT, description TEXT, type_id INTEGER, cost INTEGER, hp INTEGER, dmg_core INTEGER, dmg_unit INTEGER, dmg_resource INTEGER, max_range INTEGER, min_range INTEGER, speed INTEGER, owner_uuid TEXT, created_at DATETIME, updated_at DATETIME)''')
    db.commit()
    cursor.execute('''CREATE TABLE IF NOT EXISTS sessions (session_id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT, created_at DATETIME, updated_at DATETIME, expires_at)''')
    db.commit()
    app.run(debug=True)
    db.close()