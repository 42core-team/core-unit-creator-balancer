import React, { useState, useEffect } from 'react'
import './UnitItem.css'

const UnitItem = ({unit, index, setUnits, weight}) =>
{

	let name = unit.name || "Not Set";
	let description = unit.description || "Not Set";
	let image_src = unit.image_src || "https://cdn-icons-png.flaticon.com/512/1236/1236413.png"

	const [speed, setSpeed] = useState(unit.speed || 0);
	const speedChange = (e) => {
		setSpeed(e.target.value);
		unit.speed = e.target.value;
	}

	const [damage, setDamage] = useState(unit.damage || 0);
	const damageChange = (e) => {
		setDamage(e.target.value);
		unit.damage = e.target.value;
	}

	const [hp, setHp] = useState(unit.hp || 0);
	const hpChange = (e) => {
		setHp(e.target.value);
		unit.hp = e.target.value;
	}

	const removeUnit = () => {

		let deleteConfirm = window.confirm("Are you sure you want to remove this unit? \nThis cannot be undone and will not be saved anywhere!");
		if(!deleteConfirm) return;

		console.log("Removing unit:", unit)
		setUnits(prevUnits => prevUnits.filter(u => u.id !== unit.id));
	}

	const [strenght, setStrenght] = useState(0);
	const strenghtChange = () => {

		if(!weight) {
			setStrenght(Number(speed) + Number(damage) + Number(hp));
			return;
		}
		
		let speedVal = Number(speed) * Number(weight[0]);
		let damageVal = Number(damage) * Number(weight[1]);
		let hpVal = Number(hp) * Number(weight[2]);
		
		setStrenght(Number(speedVal) + Number(damageVal) + Number(hpVal));
	}

	useEffect(() => {
		strenghtChange();
	}, [speed, damage, hp]);

	const [cost, setCost] = useState(unit.cost || 0);
	useEffect(() => {
		let cost = Math.floor(Number(strenght) / 10);
		setCost(cost);
		unit.cost = cost;
	}, [strenght]);

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

	return(
		<div className="unit-item">
			<div class="unit-info">
				<h1>Unit Name: {name}</h1>
				<h2>Description:</h2>
				<p>{description}</p>
			</div>
			<div class="unit-stats">
				<p>Current Strenght: {strenght}</p>
				<p>Current Cost: {cost}</p>
				<ul>
					<p>Speed: ({speed})<input type="range" value={speed} onChange={speedChange}/></p>
					<p>Damage: ({damage})<input type="range" value={damage} onChange={damageChange}/></p>
					<p>HP: ({hp})<input type="range" value={hp} onChange={hpChange}/></p>
				</ul>
			</div>
			<img src={image_src} alt="No Unit image set"/>
			<div class="utils">
				<ul>
					<button onClick={copyToClipboardRUST}>Copy as Rust</button>
					<button onClick={copyToClipboardJSON}>Copy as JSON</button>
					<button onClick={removeUnit} style={{backgroundColor: 'red'}}>Remove Unit</button>
				</ul>
			</div>
		</div>
	)
}

export default UnitItem;