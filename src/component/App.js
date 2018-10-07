import React from "react";
import Canvas from './Canvas';
import "./App.css";

export default class App extends React.PureComponent {
  render() {
    return (
      <div className="component-app">
        <h3>draw below</h3>
        <Canvas />
      </div>
    );
  }
}
