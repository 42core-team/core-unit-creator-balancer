import sqlite3
import json
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import os
from datetime import datetime, timedelta
import secrets
from discord_webhook import DiscordWebhook, DiscordEmbed

app = Flask(__name__)
CORS(app)
db = None
cursor = None

def send_webhook(title: str, message: str, color = 0x00ff00):
	embed = DiscordEmbed(
		title=title,
		description=message,
		color=color,
  		timestamp=datetime.now()
	)
	webhook = DiscordWebhook(url='https://discord.com/api/webhooks/1223333924554539229/JSJuDg28o2fDvjO2_HQkbkepPzuPcSV_Okk0PNS8nF8t8Ff98Nj5P5Za6IYfcXURoHpM')
	webhook.add_embed(embed)
	response = webhook.execute()

@app.before_request
def before_request():
    g.db = sqlite3.connect('backend/database.db')
    g.cursor = g.db.cursor()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

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

@app.route('/api/user/<username>/units', methods=['GET'])
def get_user_units(username):
	g.cursor.execute('SELECT * FROM users WHERE username = ?', (username,))	
	user = g.cursor.fetchone()
	if not user:
		return jsonify({'error': 'No such user'}), 404
	g.cursor.execute('SELECT * FROM units WHERE owner_uuid = ?', (user[3],))	
	units = g.cursor.fetchall()	
	if not units:
		return jsonify({'error': 'No units found'}), 404
	send_webhook(f"User units requested from {username}", f"Units: {units}")
	return jsonify(units)

@app.route('/api/units/add', methods=['POST'])
def add_unit():
	data = request.get_json()
	session = data.get('session')
	if session is None:
		return jsonify({'error': 'You are not logged in!'}), 400
	g.cursor.execute('SELECT * FROM sessions WHERE token = ?', (session,))
	session = g.cursor.fetchone()
	if session is None:
		return jsonify({'error': 'Invalid session'}), 401
	new_unit = data.get('unit')
	if new_unit is None:
		send_webhook("Unit creation attempted", f"No unit provided")
		return jsonify({'error': 'No unit provided'}), 400
	g.cursor.execute('SELECT * FROM users WHERE user_id = ?', (session[1],))
	user = g.cursor.fetchone()
	if user is None:
		return jsonify({'error': 'No such user'}), 404
	g.cursor.execute('SELECT * FROM units WHERE owner_uuid = ? AND name = ?', (user[3], new_unit.get('name')))
	unit = g.cursor.fetchone()
	if unit is not None:
		g.cursor.execute('''
		UPDATE units 
		SET name = ?, description = ?, cost = ?, hp = ?, dmg_core = ?, dmg_unit = ?, dmg_resource = ?, max_range = ?, min_range = ?, speed = ?, updated_at = ?
		WHERE owner_uuid = ? AND name = ?
		''', (
			new_unit["name"], new_unit["description"], new_unit["cost"], new_unit["hp"], new_unit["dmg_core"],
			new_unit["dmg_unit"], new_unit["dmg_resource"], new_unit["max_range"], new_unit["min_range"], new_unit["speed"], datetime.now(),
			user[3], new_unit["name"]
		))
		g.db.commit()
		send_webhook(f"{user[1]} updated unit {new_unit['name']}", "")
		return jsonify({'success': 'Unit updated'}), 400
	g.cursor.execute('''INSERT INTO units (owner_uuid, name, description, cost, hp, dmg_core, dmg_unit, dmg_resource, max_range, min_range, speed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', (
		user[3], new_unit.get("name"), new_unit.get("description"), new_unit.get("cost"), new_unit.get("hp"), new_unit.get("dmg_core"),
     	new_unit.get("dmg_unit"), new_unit.get("dmg_resource"), new_unit.get("max_range"), new_unit.get("min_range"), new_unit.get("speed"), datetime.now(), datetime.now())
    )
	g.db.commit()
	return jsonify({'success': f"unit added: {new_unit.get('name')}"}), 200

@app.route('/api/units/all', methods=['POST'])
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
	pass_hash = data.get('hashedPassword')
	if username is None or pass_hash is None:
		return jsonify({'error': 'Missing username or password'}), 400
	g.cursor.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, pass_hash))
	user = g.cursor.fetchone()
	if user is None:
		send_webhook(f"Sign In Attempt failed", f"No such user: {username}")
		return jsonify({'error': 'Invalid username or password'}), 401
	res = {
		"session": secrets.token_hex(16),
		"expires_at": datetime.now() + timedelta(hours=1),
		"username": username
	}
	g.cursor.execute('SELECT * FROM sessions WHERE user_id = ? AND token = ?', (user[0], res["session"]))
	session = g.cursor.fetchone()
	if session is not None:
		g.cursor.execute('UPDATE sessions SET updated_at = ?, expires_at = ? WHERE user_id = ? AND token = ?', (datetime.now(), datetime.now() + timedelta(hours=1), user[0], res["session"]))
	else:
		g.cursor.execute('INSERT INTO sessions (user_id, token, created_at, updated_at, expires_at) VALUES (?, ?, ?, ?, ?)', (user[0], res["session"], datetime.now(), datetime.now(), datetime.now() + timedelta(hours=1)))
	g.db.commit()
	send_webhook(f"User logged in: {username}", f"Username: {username}\nSession: {res['session']}")
	return jsonify(res)

@app.route('/api/signup', methods=['POST'])
def signup():
	data = request.get_json()
	username = data.get('username')
	pass_hash = data.get('hashedPassword')
	send_webhook("User creation attempted", f"Username: {username}\nPassword: {pass_hash}")
	if username is None or pass_hash is None:
		return jsonify({'error': 'Missing username or password'}), 400
	g.cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
	user = g.cursor.fetchone()
	if user is not None:
		send_webhook(f"User already exists: {username}", f"Username: {username}\nPassword: {pass_hash}", 0xff0000)
		return jsonify({'error': 'Username already exists'}), 400
	g.cursor.execute('INSERT INTO users (username, password, uuid) VALUES (?, ?, ?)', (username, pass_hash, secrets.token_hex(16)))
	g.db.commit()
	send_webhook(f"New user created: {username}", f"Username: {username}\nPassword: {pass_hash}")
	return jsonify({'message': 'User created'}), 201

if __name__ == "__main__":
    db = sqlite3.connect('backend/database.db')
    cursor = db.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, username TEXT, password TEXT, uuid TEXT)''')
    db.commit()
    cursor.execute('''CREATE TABLE IF NOT EXISTS units (unit_id INTEGER PRIMARY KEY, name TEXT, description TEXT, type_id INTEGER, cost INTEGER, hp INTEGER, dmg_core INTEGER, dmg_unit INTEGER, dmg_resource INTEGER, max_range INTEGER, min_range INTEGER, speed INTEGER, owner_uuid TEXT, created_at DATETIME, updated_at DATETIME)''')
    db.commit()
    cursor.execute('''CREATE TABLE IF NOT EXISTS sessions (session_id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT, created_at DATETIME, updated_at DATETIME, expires_at DATETIME)''')
    db.commit()
    app.run(debug=True)
    db.close()