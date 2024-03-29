import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const SignIn = () => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const performSignIn = async (username, password) => {

		console.log("Signing in with username:", username, "and password" , password);

		let hashedPassword = CryptoJS.crypto.createHashed('sha256').update(password).digest('hex');

		const response = await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				hashedPassword
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error(error);
			alert(error.message);
			return;
		}

		const data = await response.json();
		console.log(data);

	}

	return (
		<div>
		<h1>Sign In</h1>
		<form onSubmit={(e) => {
			e.preventDefault();
			performSignIn(username, password);
		}}>
			<input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} name="username" required />
			<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required/>
			<button type="submit">Sign In</button>	
		</form>
		</div>
	);
};

export default SignIn;