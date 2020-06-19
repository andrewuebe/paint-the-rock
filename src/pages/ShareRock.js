import React, { Component } from "react";
import axios from "axios";
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import RockSvg from "../components/RockSvg";
import PrevRock from "../components/PrevRock";
import { Helmet } from "react-helmet";

const CurrentStage = process.env.REACT_APP_STAGE;
var serverURL = "";
if (CurrentStage === "dev" || CurrentStage === "test") {
  serverURL = "//localhost:5000";
} else if (CurrentStage === "prod") {
  serverURL = "/api";
}

var id;

class ShareRock extends Component {
  constructor() {
    super();
    this.stageParent = React.createRef();
    this.stageEl = React.createRef();
    this.state = {
      rockData: {},
      containerWidth: 0,
      rockImgUrl: "",
    };
  }

  componentDidMount() {
    console.log("painting share component mount");
    const { id } = this.props.match.params;
    console.log(id);
    axios.get(`${serverURL}/rocks/${id}`).then((res) => {
      const paintingData = res.data;
      this.setState({ rockData: paintingData });
    });
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    this.initialStageResize();
    window.addEventListener("resize", this.updateDimensions.bind(this), false);
    var canvas = document.getElementsByTagName("canvas");
    console.log(canvas);
    var dataURL = canvas[0].toDataURL("image/png");
    this.setState({ rockImgUrl: dataURL });
  }

  componentWillUnmount() {
    console.log("painting share component unmount");
    window.removeEventListener("resize", this.updateDimensions, false);
  }

  updateDimensions() {
    console.log("muahaha");
    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    this.fitStageIntoParentContainer();
  }

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
    const stage = this.stageEl.current;

    var scale = containerWidth / 1080;

    stage.width(1080 * scale);
    stage.height(1080 * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{`Rock painting by ${this.state.rockData.painterName}`}</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="Paint The Rock" />
          <meta name="twitter:title" content="Paint a digital version of The Rock" />
          <meta name="twitter:description" content={`Rock painting by ${this.state.rockData.painterName}`} />
          <meta name="twitter:image" content="https://i.imgur.com/WKHsQHT.png" />
        </Helmet>
        <h2>This worked!</h2>
        <div className="stage-parent" ref={this.stageParent}>
          <Stage ref={this.stageEl}>
            <Layer>
              <PrevRock
                containerWidth={this.state.containerWidth}
                imgData={this.state.rockData.canvasImgData}
              />
              <RockSvg containerWidth={this.state.containerWidth} />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default ShareRock;
