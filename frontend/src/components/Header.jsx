import React from 'react'
import './Header.css'
import { TextField } from '@mui/material';

const Header = ({ weights, setWeights }) => {

	return (
		<header>
		<h1>CORE Unit Creator/Balancer</h1>
		<div className="weights-container">
			<div>
				<p>Speed: </p>
				<TextField style={{width: '10vw'}} type="number" defaultValue={weights[0]} InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }} onChange={(e) => setWeights([e.target.value, weights[1], weights[2]])} />
			</div>
			<div>
				<p>Damage: </p>
				<TextField style={{width: '10vw'}} type="number" defaultValue={weights[1]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], e.target.value, weights[2]])} />
			</div>
			<div>
				<p>HP: </p>
				<TextField style={{width: '10vw'}} type="number" defaultValue={weights[2]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], weights[1], e.target.value])} />
			</div>
			{/* <p>Speed: <input type="number" defaultValue={weights[0]} min={0} max={1} step={0.01} onChange={(e) => setWeights([e.target.value, weights[1], weights[2]])}/></p>
			<p>Damage: <input type="number" defaultValue={weights[1]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], e.target.value, weights[2]])}/></p>
			<p>HP: <input type="number" defaultValue={weights[2]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], weights[1], e.target.value])}/></p> */}
		</div>
		</header>
	);
};

export default Header;