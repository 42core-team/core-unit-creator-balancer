import './App.css';
import Unit from './components/UnitItem';
import React from 'react';
import { useState, useEffect } from 'react';
import Header from "./components/Header";
import { v4 as uuidv4 } from 'uuid';
import { Signing } from './components/signinout';
import Button from '@mui/material/Button';

function App() {

  const [units, setUnits] = useState([]);
  const [weights, setWeights] = useState([1, 1, 1])

  // TODO: this has to be a in page modal box later
  const addUnit = () => {
    let name = window.prompt("Enter unit name:");
    let description = window.prompt("Enter unit description:");
    let image_src = window.prompt("Enter unit image src:");

    let urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (!urlPattern.test(image_src))
      image_src = null;

    if (!name || !description) {
      alert("Please fill in all fields");
      return;
    }

    setUnits([...units, { name, description, image_src, id: uuidv4(), weight: weights }]);
  };

    // TODO: load own units from db when logged
  useEffect(() => {

    let username = sessionStorage.getItem('username');

    if (!username) {
      return;
    }

    fetch(`http://127.0.0.1:5000/api/user/${username}/units`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .then(data => {
        setUnits(data) }
      );
  }, []);

  return (
    <div className="App">
      <Signing />
      <br></br>
      <Header weights={weights} setWeights={setWeights}/>
      <div class="unit-container">
        {units.map((unit, index) => (
          <Unit key={index} unit={unit} index={index} id={unit.id} setUnits={setUnits} weight={weights} setWeights={setWeights}/>
        ))}
      </div>
      <br></br>
      <div class="buttons">
        {/* <Button variant="outlined">Outlined</Button> */}
        <button onClick={() => { addUnit() }}>ADD UNIT</button>
      </div>
    </div>
  );
}

export default App;
