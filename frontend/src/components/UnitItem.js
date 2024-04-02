import React, { useState, useEffect } from 'react'
import './UnitItem.css'

const UnitItem = ({unit, index, setUnits, weight, id}) =>
{

	let name = unit.name || "Not Set";
	let description = unit.description || "Not Set";
	let image_src = unit.image_src || "https://cdn-icons-png.flaticon.com/512/1236/1236413.png"

	const [speed, setSpeed] = useState(unit.speed || 0);
	const speedChange = (e) => {
		const newSpeed = e.target.value;
		setSpeed(newSpeed);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, speed: newSpeed } : u));
	}

	const [hp, setHp] = useState(unit.hp || 0);
	const hpChange = (e) => {
		const newHp = e.target.value;
		setHp(newHp);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, hp: newHp } : u));
	}

	const [damage_unit, setDamageUnit] = useState(unit.dmg_unit || 0);
	const [damage_core, setDamageCore] = useState(unit.dmg_core ||0);
	const [damage_resource, setDamageResource] = useState(unit.dmg_resource || 0);
	const [min_range, setMinRange] = useState(unit.min_range || 0);
	const [max_range, setMaxRange] = useState(unit.max_range || 0);

	const removeUnit = () => {

		alert("For now for some reason this does weird things with the units in the list below, wehre the values will change weirdly so i would consider just not deleting it for now");

		let deleteConfirm = window.confirm("Are you sure you want to remove this unit? \nThis cannot be undone and will not be saved anywhere!");
		if(!deleteConfirm) return;

		console.log("Removing unit:", unit)
		setUnits(prevUnits => prevUnits.filter(u => u.id !== unit.id));
	}

	const [strenght, setStrenght] = useState(0);
	useEffect(() => {
		if(!weight) {
			setStrenght(Number(speed) + Number(damage_resource) + Number(hp) + Number(damage_core) + Number(damage_unit) + Number(max_range - min_range));
			return;
		}
		
		let speedVal = Number(speed) * Number(weight[0]);
		let damageVal = (Number(damage_core)  + Number(damage_unit) + Number(damage_resource)) * Number(weight[1]);
		let hpVal = Number(hp) * Number(weight[2]);
		let rageVal = (Number(max_range) - Number(min_range)) * Number(weight[0]);
		
		setStrenght(Number(speedVal) + Number(damageVal) + Number(hpVal) + Number(rageVal));
	}, [speed, damage_core, damage_unit, damage_resource, hp, weight, max_range, min_range]);

	const [cost, setCost] = useState(unit.cost || 0);
	useEffect(() => {
		let cost = Math.floor(Number(strenght) / 100);
		setCost(cost);
		unit.cost = cost;
	}, [strenght, unit]);

	useEffect(() => {
		unit.dmg_unit = damage_unit;
		unit.dmg_core = damage_core;
		unit.dmg_resource = damage_resource;
		unit.min_range = min_range;
		unit.max_range = max_range;
	}, [damage_unit, damage_core, damage_resource, min_range, max_range, unit]);

	const damageUnitChange = (e) => {
		setDamageUnit(e.target.value);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, dmg_unit: e.target.value } : u));
	}

	const damageCoreChange = (e) => {
		setDamageCore(e.target.value);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, dmg_core: e.target.value } : u));
	}

	const damageResourceChange = (e) => {
		setDamageResource(e.target.value);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, dmg_resource: e.target.value } : u));
	}

	const minRangeChange = (e) => {
		setMinRange(e.target.value);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, min_range: e.target.value } : u));
	}

	const maxRangeChange = (e) => {
		setMaxRange(e.target.value);
		setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, max_range: e.target.value } : u));
	}

	const copyToClipboardJSON = () => {
		console.log("Copying unit to clipboard:", JSON.stringify(unit))
		navigator.clipboard.writeText(JSON.stringify(unit));
	}

	const copyToClipboardRUST = () => {
		let rustUnit = `UnitConfig {
			name: String::from("${unit.name || "Not Set"}"),
			type_id: ${unit.type_id || -1},
			cost: ${unit.cost || -1},
			hp: ${unit.hp || -1},
			dmg_core: ${unit.dmg_core || -1},
			dmg_unit: ${unit.dmg_unit || -1},
			dmg_resource: ${unit.dmg_resource || -1},
			max_range: ${unit.max_range || -1},
			min_range: ${unit.min_range || -1},
			speed: ${unit.speed || -1},
		}`;
		console.log("Copying unit to clipboard:", rustUnit)
		navigator.clipboard.writeText(rustUnit);
	}

	const update_unit = async () => {

		const response = await fetch('http://localhost:5000/api/units/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				session: sessionStorage.getItem('session'),
				unit: {
					id: unit.id || -1,
					name: unit.name || "Not Set",
					description: unit.description || "Not Set",
					cost: unit.cost || -1,
					hp: unit.hp || -1,
					dmg_core: unit.dmg_core || -1,
					dmg_unit: unit.dmg_unit || -1,
					dmg_resource: unit.dmg_resource || -1,
					max_range: unit.max_range || -1,
					min_range: unit.min_range || -1,
					speed: unit.speed || -1,
				}
			}),
		});

		const data = await response.json();
		console.log("Updated unit:", data);

	}

	return(
		<div className="unit-item">
			<div class="unit-info">
				<h1>Unit Name: {name}</h1>
				<h2>Description:</h2>
				<p>{description}</p>
			</div>
			<div className="unit-stats">
				<p>Current Strenght: {strenght}</p>
				<p>Current Cost: {cost}</p>
				<p>Speed: ({speed})<input type="range" value={speed} min={100} max={100000} step={100} onChange={speedChange}/></p>
				<p>HP: ({hp})<input type="range" value={hp} min={100} max={100000} step={100} onChange={hpChange}/></p>
				<p>Damage Unit: ({damage_unit})<input type="range" value={damage_unit} min={100} max={100000} step={100} onChange={damageUnitChange}/></p>
				<p>Damage Core: ({damage_core})<input type="range" value={damage_core} min={100} max={100000} step={100} onChange={damageCoreChange}/></p>
				<p>Damage Resource: ({damage_resource})<input type="range" value={damage_resource} min={100} max={100000} step={100} onChange={damageResourceChange}/></p>
				<p>Min Range: ({min_range})<input type="range" value={min_range} min={100} max={100000} step={100} onChange={minRangeChange}/></p>
				<p>Max Range: ({max_range})<input type="range" value={max_range} min={100} max={100000} step={100} onChange={maxRangeChange}/></p>
			</div>
			<img src={image_src} alt="Unit Logo"/>
			<div class="utils">
				<ul>
					<button onClick={copyToClipboardRUST}>Copy as Rust</button>
					<button onClick={copyToClipboardJSON}>Copy as JSON</button>
					<button onClick={
						() => {
							let newDescription = window.prompt("Enter new description:");
							if(newDescription) {
								unit.description = newDescription;
								setUnits(prevUnits => prevUnits.map(u => u.id === unit.id ? { ...u, description: newDescription } : u));
							}
						}
					}>Change Description</button>
					<button onClick={update_unit} style={{backgroundColor: 'green'}}>Save Changes</button>
					<button onClick={removeUnit} style={{backgroundColor: 'red'}}>Remove Unit</button>
					<p>Dont forget to save your changes!</p>
				</ul>
			</div>
		</div>
	)
}

export default UnitItem;