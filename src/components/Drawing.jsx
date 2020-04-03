import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

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


export default Drawing;
