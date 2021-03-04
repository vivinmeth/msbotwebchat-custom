import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Webchat from './webchat';

class App extends Component {
    botCont = {
        width: "500px",
        height: "50vh",
        boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.12)",
        margin: "0 auto"
    }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <div style={this.botCont}>
              <Webchat></Webchat>
          </div>

      </div>
    );
  }
}

export default App;
