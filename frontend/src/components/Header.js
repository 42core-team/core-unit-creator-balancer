import React from 'react'
import './Header.css'
import { useState, useEffect } from 'react';

const Header = ({ weights, setWeights }) => {

	return (
		<header>
		<h1>CORE Unit Creator/Balancer</h1>
		<div class="weights-container">
			<p>Speed: <input type="number" defaultValue={weights[0]} min={0} max={1} step={0.01} onChange={(e) => setWeights([e.target.value, weights[1], weights[2]])}/></p>
			<p>Damage: <input type="number" defaultValue={weights[1]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], e.target.value, weights[2]])}/></p>
			<p>HP: <input type="number" defaultValue={weights[2]} min={0} max={1} step={0.01} onChange={(e) => setWeights([weights[0], weights[1], e.target.value])}/></p>
		</div>
		</header>
	)
}

export default Header;