import React, { Component } from "react";
import "./App.css";
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { SliderPicker, CirclePicker} from "react-color";
import CurrentColor from "./components/CurrentColor";
import CurrentSize from "./components/CurrentSize";
import BrushSizePicker from "./components/BrushSizePicker"
import RockSvg from "./components/RockSvg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import nuPurple from "@material-ui/core/colors/nuPurple";

const theme = createMuiTheme({
  palette: {
    primary: nuPurple
  },
  typography: {
    fontFamily: ['"Akkurat Pro Regular"'],
    color: "#ffffff"
  }
});

class App extends Component {
  constructor() {
    super();
    this.stageEl = React.createRef();
    this.layerEl = React.createRef();
    this.stageParent = React.createRef();

    this.state = {
      isPaint: false,
      lastLine: {},
      containerWidth: 0,
      historyCount: 0,
      curBrushColor: "#4e2a84",
      curBrushSize: 35,
      colorButtonClicked: false,
      sizeButtonClicked: false,
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
        "#5091CD"
      ]
    };
  }

  componentDidMount() {
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    this.initialStageResize();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    this.fitStageIntoParentContainer();
  }

  onMouseDown = () => {
    this.setState({ isPaint: true, historyCount: this.state.historyCount + 1 });
    const pos = this.stageEl.current.getPointerPosition();
    const containerWidth = this.state.containerWidth;
    var scale = containerWidth / 1080;
    const lastLine = new Konva.Line({
      stroke: this.state.curBrushColor,
      strokeWidth: this.state.curBrushSize,
      lineJoin: "round",
      lineCap: "round",
      name: "line_" + this.state.historyCount.toString(),
      globalCompositeOperation: "source-over",
      points: [pos.x / scale, pos.y / scale]
    });
    this.setState({ lastLine: lastLine });
    this.layerEl.current.add(lastLine);
  };

  onMouseUp = () => {
    this.setState({ isPaint: false });
  };

  onMouseMove = () => {
    if (!this.state.isPaint) {
      return;
    }
    const containerWidth = this.state.containerWidth;
    var scale = containerWidth / 1080;
    const lastLine = this.state.lastLine;
    const pos = this.stageEl.current.getPointerPosition();
    let newPoints = lastLine.points().concat([pos.x / scale, pos.y / scale]);
    lastLine.points(newPoints);
    this.setState({ lastLine: lastLine });
    this.layerEl.current.batchDraw();
  };

  initialStageResize() {
    const containerWidth = this.stageParent.current.offsetWidth;
    const stage = this.stageEl.current;
    var scale = containerWidth / 1080;

    stage.width(1080 * scale);
    stage.height(1080 * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
  }

  fitStageIntoParentContainer() {
    const containerWidth = this.state.containerWidth;
    console.log(containerWidth);
    const stage = this.stageEl.current;
    console.log(stage);

    var scale = containerWidth / 1080;

    console.log(scale);

    stage.width(1080 * scale);
    stage.height(1080 * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
  }

  handleUndo = () => {
    if (this.state.historyCount === 0) {
      return;
    } else {
      const layer = this.layerEl.current;
      var children = layer.getChildren();
      console.log(children);
      children[this.state.historyCount - 1].remove();
      this.setState({ historyCount: this.state.historyCount - 1 });
      this.layerEl.current.batchDraw();
    }
  };

  handleChangeComplete = color => {
    this.setState({ curBrushColor: color.hex });
  };

  handleColorClick = () => {
    var isColorClicked = this.state.colorButtonClicked;
    this.setState({sizeButtonClicked: false})
    this.setState({ colorButtonClicked: !isColorClicked });
    return;
  };

  handleSizeClick = () => {
    var isSizeClicked = this.state.sizeButtonClicked;
    this.setState({colorButtonClicked: false})
    this.setState({ sizeButtonClicked: !isSizeClicked });
    return;
  };

  handleSizeChange = (sizeInt) => {
    sizeInt = Math.ceil(0.005 * (sizeInt * sizeInt));
    console.log(sizeInt)
    this.setState({curBrushSize: sizeInt});
  }

  handleOverlayClick = () => {
    this.setState({sizeButtonClicked: false, colorButtonClicked: false});
  }

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
    const ColorPicker = (
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

    const SizePicker = (
      <div className="size-picker">
        <BrushSizePicker curBrushSize={this.state.curBrushSize} handleSizeChange={this.handleSizeChange}/>
      </div>
    );

    const ControlsOverlay = (
      <div className="controls-overlay">
        {this.state.colorButtonClicked && (ColorPicker)}
        {this.state.sizeButtonClicked && (SizePicker)}
      </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
      <div className="app-container">
        <div className="control-bar">
          <div className="undo-button">
          <FontAwesomeIcon icon={faUndo} size="4x" onClick={this.handleUndo}/>
          <div className="undo-text">Undo</div>
          </div>
          <div className="settings">
          {this.state.sizeButtonClicked && ControlsOverlay}
          {this.state.colorButtonClicked && ControlsOverlay}
          </div>
          <div className="color-size-buttons">
          <CurrentColor handleColorClick={this.handleColorClick} curColor={this.state.curBrushColor}/>
          <CurrentSize handleSizeClick={this.handleSizeClick} brushSize={this.state.curBrushSize}/>
          </div>
        </div>
        <div className="stage-parent" ref={this.stageParent}>
          <Stage
            width={1080}
            height={1080}
            ref={this.stageEl}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onTouchStart={this.onMouseDown}
            onTouchMove={this.onMouseMove}
            onTouchEnd={this.onMouseUp}
          >
            <Layer ref={this.layerEl}></Layer>
            <Layer>
              <RockSvg containerWidth={this.state.containerWidth} />
            </Layer>
          </Stage>
        </div>
        <div onClick={this.handleOverlayClick} className={`overlay ${this.state.colorButtonClicked ? "active" : ""} ${this.state.sizeButtonClicked ? "active" : ""}`}></div>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;