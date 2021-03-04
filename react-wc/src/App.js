import React from 'react';
import logo from './logo.svg';
import './App.css';
import Webchat from "./webchat";

function App() {
  return (
    <div className="App">
      <div style={botCont}>
        <Webchat></Webchat>
      </div>
    </div>
  );
}

const botCont = {
  width: "500px",
  height: "50vh",
  boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.12)",
  margin: "0 auto"
}

export default App;
