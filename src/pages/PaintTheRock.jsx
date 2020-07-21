import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { SliderPicker, CirclePicker } from "react-color";
import CurrentColor from "../components/CurrentColor";
import CurrentSize from "../components/CurrentSize";
import BrushSizePicker from "../components/BrushSizePicker";
import RockSvg from "../components/RockSvg";
import PrevRock from "../components/PrevRock";
import SaveRock from "../components/SaveRock";
import PaintingHistory from "../pages/PaintingHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import SaveModal from "../components/SaveModal";

const CurrentStage = process.env.REACT_APP_STAGE;
var serverURL = "";
if (CurrentStage === "dev" || CurrentStage === "test") {
  serverURL = "//localhost:5000";
} else if (CurrentStage === "prod") {
  serverURL = "/api";
}

// Colors for MUI
var nuPurple = {
  50: "#f3e5f5",
  100: "#e1bee7",
  200: "#ce93d8",
  300: "#ba68c8",
  400: "#ab47bc",
  500: "#4e2a84",
  600: "#8e24aa",
  700: "#7b1fa2",
  800: "#6a1b9a",
  900: "#4a148c",
  A100: "#ea80fc",
  A200: "#e040fb",
  A400: "#d500f9",
  A700: "#aa00ff",
};

const theme = createMuiTheme({
  palette: {
    primary: nuPurple,
  },
  typography: {
    fontFamily: ['"Akkurat Pro Regular"'],
    color: "#ffffff",
  },
});

// App component
class PaintTheRock extends Component {
  constructor(props) {
    super(props);
    this.stageEl = React.createRef();
    this.layerEl = React.createRef();
    this.stageParent = React.createRef();

    this.state = {
      prevPainterName: "",
      prevPainterSaveDate: "",
      prevPainterSaveTime: "",
      prevPaintingSave: {
        lastModifiedDate: "",
        painterName: "",
        canvasImgData: "",
      },
      curPaintingSave: {
        lastModifiedDate: "",
        painterName: "temp_27730",
        canvasImgData: "",
      },
      isSaveModalOpen: false,
      saveError: {
        isError: false,
        errorMsg: "",
      },
      isPaintingReported: false,
      isPaint: false,
      lastLine: {},
      containerWidth: 0,
      historyCount: 0,
      curBrushColor: "#4e2a84",
      curBrushSize: 35,
      colorButtonClicked: false,
      sizeButtonClicked: false,
      paintingSaved: false,
      imgShareData: "",
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
    this.updateDimensions = this.updateDimensions.bind(this); // bind function once
  }

  componentDidMount() {
    console.log("tahaha");
    axios.get(`${serverURL}/rocks/last`).then((res) => {
      const prevPaintingData = res.data;
      this.setState({ prevPaintingSave: prevPaintingData });
    });

    this.setState({ containerWidth: this.stageParent.current.offsetWidth });
    this.initialStageResize();
    window.addEventListener("resize", this.updateDimensions, false);
    this.updateSaveDate();
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    console.log("tahaha 2");
    window.removeEventListener("resize", this.updateDimensions, false);
  }

  updateSaveDate() {
    var currentdate = new Date();
    var datetime =
      currentdate.getMonth() +
      1 +
      "/" +
      currentdate.getDate() +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    var newPaintingSave = this.state.curPaintingSave;
    newPaintingSave.lastModifiedDate = datetime;
    this.setState({ curPaintingSave: newPaintingSave });
  }

  updateDimensions() {
    console.log("muahaha");
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
      points: [pos.x / scale, pos.y / scale],
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
    const stage = this.stageEl.current;

    var scale = containerWidth / 1080;

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
      children[this.state.historyCount].remove();
      this.setState({ historyCount: this.state.historyCount - 1 });
      this.layerEl.current.batchDraw();
    }
  };

  handleChangeComplete = (color) => {
    this.setState({ curBrushColor: color.hex });
  };

  handleColorClick = () => {
    var isColorClicked = this.state.colorButtonClicked;
    this.setState({ sizeButtonClicked: false });
    this.setState({ colorButtonClicked: !isColorClicked });
    return;
  };

  handleSizeClick = () => {
    var isSizeClicked = this.state.sizeButtonClicked;
    this.setState({ colorButtonClicked: false });
    this.setState({ sizeButtonClicked: !isSizeClicked });
    return;
  };

  handleSizeChange = (sizeInt) => {
    sizeInt = Math.ceil(0.005 * (sizeInt * sizeInt));
    console.log(sizeInt);
    this.setState({ curBrushSize: sizeInt });
  };

  handleOverlayClick = () => {
    this.setState({ sizeButtonClicked: false, colorButtonClicked: false });
  };

  spanCircleSize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 700) {
      return 40;
    } else {
      return 28;
    }
  };

  changeName = (input) => {
    const newSaveError = { errorMsg: "", isError: false };
    this.setState({ saveError: newSaveError });
    const name = input;
    console.log(name);
    var tempPaintingSave = this.state.curPaintingSave;
    console.log(tempPaintingSave);
    tempPaintingSave.painterName = name;
    this.setState({ curPaintingSave: tempPaintingSave });
  };

  handleSaveRock = () => {
    this.updateSaveDate();
    var canvas = document.getElementsByTagName("canvas");
    var canvas = canvas[0];
    var dataURL = canvas.toDataURL("image/png");
    var newPaintingSave = this.state.curPaintingSave;
    newPaintingSave.canvasImgData = dataURL;
    this.setState({ curPaintingSave: newPaintingSave });
    this.uploadImgToServer(newPaintingSave);
  };

  uploadImgToServer = (imgData) => {
    axios
      .post(`${serverURL}/rocks/add`, {
        lastModifiedDate: imgData.lastModifiedDate,
        painterName: imgData.painterName,
        canvasImgData: imgData.canvasImgData,
        numOfReports: 0,
        paintedOverName: this.state.prevPaintingSave.painterName,
        paintedOverId: this.state.prevPaintingSave._id
      })
      .then((response) => {
        console.log(response);
        if (!response.data.errmsg) {
          console.log(`rock succesfully added!`);
          this.setState({ isSaveModalOpen: false });
          axios.get(`${serverURL}/rocks/last`).then((res) => {
            const prevPaintingData = res.data;
            this.setState({ prevPaintingSave: prevPaintingData });
          });
          this.setState({ historyCount: 0 });
          this.setState({ paintingSaved: true }, () => {
            var finalCanvas = document.getElementsByTagName("canvas");
            var finalCanvas = finalCanvas[0];
            var finalDataURL = finalCanvas.toDataURL("image/png");
            this.setState({ imgShareData: finalDataURL });
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };


  reportPrevPainting = () => {
    const prevPaintingId = this.state.prevPaintingSave._id;
    axios
      .post(`${serverURL}/rocks/report/` + prevPaintingId)
      .then((response) => {
        console.log(response);
        if (!response.data.errmsg) {
          console.log(`Rock succesfully reported. Thank you.`);
          this.setState({ isPaintingReported: true });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleOpenModal = () => {
    const curPainterName = this.state.curPaintingSave.painterName;
    const curPainterNameNoSpaces = curPainterName.replace(/\s/g, "");
    if (curPainterName != "temp_27730" && curPainterNameNoSpaces.length) {
      console.log("true");
      this.setState({ isSaveModalOpen: true });
    } else {
      var saveError = {
        isError: true,
        errorMsg:
          curPainterName === "temp_27730"
            ? "You must enter your name before saving."
            : "Your name must contain characters other than spaces.",
      };
      this.setState({ saveError: saveError });
    }
  };

  handleCloseModal = () => {
    this.setState({ isSaveModalOpen: false });
  };

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
        <BrushSizePicker
          curBrushSize={this.state.curBrushSize}
          handleSizeChange={this.handleSizeChange}
        />
      </div>
    );

    const SaveModalAppear = (
      <SaveModal
        handleCloseModal={this.handleCloseModal}
        handleSaveRock={this.handleSaveRock}
      />
    );

    const ControlsOverlay = (
      <div className="controls-overlay">
        {this.state.colorButtonClicked && ColorPicker}
        {this.state.sizeButtonClicked && SizePicker}
      </div>
    );

    const rockPaintableCanvas = (
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
          <Layer ref={this.layerEl}>
            <PrevRock
              containerWidth={this.state.containerWidth}
              imgData={this.state.prevPaintingSave.canvasImgData}
            />
          </Layer>
          <Layer>
            <RockSvg containerWidth={this.state.containerWidth} />
          </Layer>
        </Stage>
      </div>
    );

    const rockNonPaintableCanvas = (
      <div className="stage-parent" ref={this.stageParent}>
        <Stage ref={this.stageEl} width={1080} height={1080}>
          <Layer>
            <PrevRock
              containerWidth={this.state.containerWidth}
              imgData={this.state.prevPaintingSave.canvasImgData}
            />
            <RockSvg containerWidth={this.state.containerWidth} />
          </Layer>
        </Stage>
      </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <div className="app-container">
          <div className={!this.state.paintingSaved ? `control-bar` : `control-bar hide-element`}>
            <div
              className={`undo-button${
                this.state.historyCount === 0 ? " no-history" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faUndo}
                size="4x"
                onClick={this.handleUndo}
              />
              <div className="undo-text">Undo</div>
            </div>
            <div className="settings">
              {this.state.sizeButtonClicked && ControlsOverlay}
              {this.state.colorButtonClicked && ControlsOverlay}
            </div>
            <div className="color-size-buttons">
              <CurrentColor
                handleColorClick={this.handleColorClick}
                curColor={this.state.curBrushColor}
              />
              <CurrentSize
                handleSizeClick={this.handleSizeClick}
                brushSize={this.state.curBrushSize}
              />
            </div>
          </div>
          {!this.state.paintingSaved
            ? rockPaintableCanvas
            : rockNonPaintableCanvas}
          <div className="save-rock">
            <div className="last-save">
              {this.state.paintingSaved ? `You just saved your painting under the name:` : `The rock was last painted by`}
              <div className="last-save-name">
                {this.state.prevPaintingSave.painterName}
              </div>
              <div className="save-date-time">
                {this.state.prevPaintingSave.lastModifiedDate}
              </div>
              {!this.state.isPaintingReported && (
                <button
                  className="report-painting"
                  onClick={this.reportPrevPainting}
                >
                  Report this painting
                </button>
              )}
              {this.state.isPaintingReported && (
                <p>
                  Thank you for submitting a report. We will investigate, and
                  take necessary action.
                </p>
              )}
              <Link className="past-paintings-btn" to="/painting-history">
                See all past paintings
              </Link>
            </div>
            <SaveRock
              saveError={this.state.saveError}
              changeName={this.changeName}
              handleOpenModal={this.handleOpenModal}
              paintingSaved={this.state.paintingSaved}
              prevPaintingId={this.state.prevPaintingSave._id}
            />
          </div>
          <div
            onClick={this.handleOverlayClick}
            className={`overlay${
              this.state.colorButtonClicked ? " active" : ""
            }${this.state.sizeButtonClicked ? " active" : ""}${
              this.state.isSaveModalOpen ? " modal" : ""
            }`}
          >
            {this.state.isSaveModalOpen && SaveModalAppear}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default PaintTheRock;
