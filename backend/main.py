import sqlite3
import json
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# The config version is the version name as inside the config.rs in the game source code
@app.route('/api/<version>/config', methods=['GET'])
def get_config(version):
	if os.path.exists(f'config_{version}.json'):
		with open(f'config/config_{version}.json', 'r') as f:
			config = json.load(f)
		return jsonify(config)
	else:
		return jsonify({'error': 'Config file not found'})

if __name__ == "__main__":
    app.run(debug=True)