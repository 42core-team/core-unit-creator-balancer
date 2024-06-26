import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './AccountAction.css';
import {TextField, Button} from '@material-ui/core';

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
		<h2 className="h2color">Sign Up</h2>
		<form onSubmit={(e) => {
			e.preventDefault();
			performSignIn(username, password);
		}}>
			<div className='textfieldgap'>
				<TextField style={{color: "white", borderColor: "white", backgroundColor: "rgb(63, 63, 63)"}} id="filled-basic" label="Username" variant="filled" onChange={(e) => setUsername(e.target.value)} required/>
				<TextField style={{color: "white", borderColor: "white", backgroundColor: "rgb(63, 63, 63)"}} id="filled-basic" label="Password" variant="filled" onChange={(e) => setPassword(e.target.value)} required/>
				<Button style={{color: "darkgray", backgroundColor: "rgb(63, 63, 63)"}} type="submit" variant="contained" color="primary">Sign Up</Button>
			</div>
			{/* <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} name="username" required />
			<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} name="password" required/>
			<button type="submit">Sign Up</button>	 */}
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
		<h2 className='h2color'>Sign In</h2>
		<form onSubmit={(e) => {
			e.preventDefault();
			performSignIn(username, password);
		}}>
			<div className='textfieldgap'>
				<TextField style={{color: "white", borderColor: "white", backgroundColor: "rgb(63, 63, 63)"}} id="filled-basic" label="Username" variant="filled" onChange={(e) => setUsername(e.target.value)} required/>
				<TextField style={{color: "white", borderColor: "white", backgroundColor: "rgb(63, 63, 63)"}} id="filled-basic" label="Password" variant="filled" onChange={(e) => setPassword(e.target.value)} required/>
				<Button style={{color: "darkgray", backgroundColor: "rgb(63, 63, 63)"}} type="submit" variant="contained" color="primary">Sign In</Button>
			</div>
			{/* <input type="text" placeholder="Username"  name="username" required />
			<input type="password" placeholder="Password"  name="password" required/>
			<button type="submit">Sign In</button>	 */}
		</form>
		</div>
	);
};

export { SignIn, SignUp };