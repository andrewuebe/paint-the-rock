import React, { Component } from "react";
import { SliderPicker, CirclePicker } from "react-color";
import Css from "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      curBrushColor: "#4e2a84",
      colorOptions: [
        "#401F68",
        "#4e2a84",
        "#836EAA",
        "#B6ACD1",
        "#E4E0EE",
        "#000000",
        "#342F2E",
        "#716C6B",
        "#D8D6D6",
        "#ffffff",
        "#EF553F",
        "#EDE93B",
        "#58B947",
        "#7FCECD",
        "#5091CD",
      ],
    };
  }

  handleChangeComplete = (color) => {
    this.setState({ curBrushColor: color.hex });
  };

  handleColorChange = ({ hex }) => console.log(hex);

  spanCircleSize = () => {
    const windowWidth = window.innerWidth;
    console.log(windowWidth);
    if(windowWidth > 700){
      return 40;
    } else {
      return 28;
    }
    
  }

  render() {
    return (
      <div className="color-picker-menu">
        <div className="color-slider-picker">
          <SliderPicker
            color={this.state.curBrushColor}
            onChangeComplete={this.handleChangeComplete}

          />
        </div>
        <div className="color-swatch">
          <CirclePicker
            color={this.state.curBrushColor}
            onChangeComplete={this.handleChangeComplete}
            colors={this.state.colorOptions}
            width="100%"
            circleSize={this.spanCircleSize()}
            circleSpacing={32}
          />
        </div>
      </div>
    );
  }
}

export default App;
