from flask import Flask, request, jsonify

# a route is always built like this: /api/{GAME_VERSION}/units

@app.route('/api/v1/units', methods=['GET'])
	return jsonify({'units': units})