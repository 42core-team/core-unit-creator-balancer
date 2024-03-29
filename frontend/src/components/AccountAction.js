import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const SignUp = () => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const performSignIn = async (username, password) => {

		console.log("Signing in with username:", username, "and password" , password);

		let hashedPassword = CryptoJS.SHA256(password).toString();

		const response = await fetch('http://localhost:5000/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				hashedPassword
			}),
		});

		const contentType = response.headers.get('content-type');

		if (!response.ok) {
			let error;
			if (contentType && contentType.includes('application/json')) {
				error = await response.json();
			} else {
				error = await response.text();
			}
			console.error(error);
			return;
		}

		const data = await response.json();
		console.log(data);

	}

	return (
		<div>
		<h1>Sign Up</h1>
		<form onSubmit={(e) => {
			e.preventDefault();
			performSignIn(username, password);
		}}>
			<input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} name="username" required />
			<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required/>
			<button type="submit">Sign Up</button>	
		</form>
		</div>
	);
};

const SignIn = () => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const performSignIn = async (username, password) => {

		console.log("Signing in with username:", username, "and password" , password);

		let hashedPassword = CryptoJS.SHA256(password).toString();

		const response = await fetch('http://localhost:5000/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				hashedPassword
			}),
		});

		const contentType = response.headers.get('content-type');

		if (!response.ok) {
			let error;
			if (contentType && contentType.includes('application/json')) {
				error = await response.json();
			} else {
				error = await response.text();
			}
			console.error(error);
			return;
		}

		const data = await response.json();
		let session = data.session;
		localStorage.setItem('session', session);
		sessionStorage.setItem('session', session);

		let sessionExpire = data.expires_at;
		localStorage.setItem('sessionExpire', sessionExpire);
		sessionStorage.setItem('sessionExpire', sessionExpire);

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

export { SignIn, SignUp };