import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

// load last saved rock screenshot
const ImageScreenshot = props => {
  const [image] = useImage(
    "https://assets.ard.northwestern.edu/files/2020/paint-the-rock/starting-img.png"
  );
  return (
    <Image
      image={image}
      width={props.containerWidth}
      height={props.containerWidth}
    />
  );
};

// load undo img screenshot
const UndoImg = props => {
  console.log(props.imgSave.length);
  const [image] = useImage(props.imgSave);
  return (
    <Image
      image={image}
      width={props.containerWidth}
      height={props.containerWidth}
    />
  );
};

// load Rock SVG
const RockSvg = props => {
  const [image] = useImage(
    "https://assets.ard.northwestern.edu/files/2020/paint-the-rock/therock.svg"
  );
  return (
    <Image
      image={image}
      width={props.containerWidth}
      height={props.containerWidth}
    />
  );
};

// Drawing part
class Drawing extends Component {
  state = {
    isDrawing: false,
    creatingLine: false,
    prevStage: {},
    historyStep: 0,
  };

  componentDidMount() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const context = canvas.getContext("2d");

    this.setState({ canvas, context });
    this.setState({prevCanvas: canvas, prevContext: context});
  }

  handleMouseDown = () => {
    this.setState({ isDrawing: true });
    this.setState({prevCanvas: this.state.canvas, prevContext: this.state.context});
    const stage = this.image.getStage();
    const stageJson = stage.toJSON();
    this.setState({ prevStage: stageJson });
    this.lastPointerPosition = stage.getPointerPosition();
  };

  handleMouseMove = ({ evt }) => {
    const { context, isDrawing } = this.state;
    if (isDrawing) {
      this.setState({ creatingLine: true });
      context.strokeStyle = this.props.brushColor;
      context.lineJoin = "round";
      context.lineWidth = this.props.brushSize;

      context.globalCompositeOperation = "source-over";

      context.beginPath();

      var scale = this.props.containerWidth / 1080;

      var localPos = {
        x: (this.lastPointerPosition.x - this.image.x()) / scale,
        y: (this.lastPointerPosition.y - this.image.y()) / scale
      };
      context.moveTo(localPos.x, localPos.y);

      const stage = this.image.getStage();

      var pos = stage.getPointerPosition();
      localPos = {
        x: (pos.x - this.image.x()) / scale,
        y: (pos.y - this.image.y()) / scale
      };
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      this.lastPointerPosition = pos;
      this.image.getLayer().draw();
    }
  };

  handleMouseUp = () => {
    this.setState({
      isDrawing: false,
      creatingLine: false
    });
  };

  handleUndo = () => {
    if (this.state.historyStep > 0) {
      const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const context = canvas.getContext("2d");

    this.setState({ canvas, context });
    } else {
      console.log("no history");
    }
  };

  render() {
    const { canvas } = this.state;
    return (
      <Image
        image={canvas}
        ref={node => (this.image = node)}
        width={this.props.containerWidth}
        height={this.props.containerWidth}
      />
    );
  }
}

// The whole canvas
class TheRock extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.state = {
      isDrawing: false,
      mode: "brush",
      brushSize: 25,
      color: "#4e2a84",
      lastLayerState: {},
      mySpecialMsg: "nothing",
      historyStep: 0,
      bgColor: "red",
      localPos: {
        x: 0,
        y: 0
      },
      imgSave: []
    };
  }

  handleMouseDown = () => {
    this.setState({ isDrawing: true, bgColor: "blue", historyStep: this.state.historyStep + 1 });
    this.myRef.current.handleMouseDown();

    var canvas = document.getElementsByTagName("canvas");
    var canvas = canvas[2];

    // save to local storage
    var theImg = canvas.toDataURL("image/png");
    const myNewStateImgSave = this.state.imgSave
    console.log(myNewStateImgSave);
    myNewStateImgSave.push(theImg)
    this.setState({ imgSave: myNewStateImgSave });
  };

  handleMouseMove = ({ evt }) => {
    if (this.state.isDrawing) {
      this.setState({ bgColor: "purple" });
      this.myRef.current.handleMouseMove(evt);
    }
  };

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
    this.myRef.current.handleMouseUp();
  };

  handleUndo = () => {
    this.setState({historyStep: this.statehistoryStep - 1})
    this.myRef.current.handleUndo();
  };

  render() {
    return (
      <Stage
        // stage dimensions are handled by its container's width
        width={this.props.containerWidth}
        height={this.props.containerWidth}
        // mouse events
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        // touch events
        onTouchStart={this.handleMouseDown}
        onTouchMove={this.handleMouseMove}
        onTouchEnd={this.handleMouseUp}
        onTouchCancel={this.handleMouseUp}
      >
        <Layer>
          <ImageScreenshot containerWidth={this.props.containerWidth} />
        </Layer>
        <Layer>
          <UndoImg
            imgSave={this.state.imgSave}
            containerWidth={this.props.containerWidth}
            historyStep={this.state.historyStep}
          />
        </Layer>
        <Layer>
          <Drawing
            ref={this.myRef}
            containerWidth={this.props.containerWidth}
            brushSize={this.state.brushSize}
            brushColor={this.state.color}
          />
        </Layer>
        <Layer>
          <RockSvg containerWidth={this.props.containerWidth} />
        </Layer>
      </Stage>
    );
  }
}

export default TheRock;
