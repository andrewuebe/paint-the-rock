import React, { Component } from "react";
import "./App.css";

import TheRock from "./components/TheRock";

class App extends Component {
  constructor(props) {
    super(props);
    this.stageParent = React.createRef();
    this.rockRef = React.createRef();
    this.state = {
      containerWidth: 0,
      imgScreenshot: ""
    };
  }

  updateDimensions() {
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
  }

  componentDidMount() {
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  handleUndo = () => {
    this.rockRef.current.handleUndo();
  };

  takeScreenshot = () => {
    var canvas = document.getElementsByTagName("canvas");
    var canvas = canvas[1];

    // save to local storage
    localStorage.setItem("imgCanvas", canvas.toDataURL("image/png"));

    var img = canvas.toDataURL("image/png");

    document.write('<img src="'+img+'"/>');

  };

  render() {
    return (
      <div className="app-container">
        <div className="stage-parent" ref={this.stageParent}>
          <TheRock
            ref={this.rockRef}
            containerWidth={this.state.containerWidth}
            imgScreenshot={this.state.imgScreenshot}
          ></TheRock>
        </div>
        <button onClick={this.handleUndo}>Undo</button>
        <button onClick={this.takeScreenshot}>Screenshot</button>
      </div>
    );
  }
}

export default App;
