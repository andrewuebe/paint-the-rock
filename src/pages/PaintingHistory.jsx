import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";

const CurrentStage = process.env.REACT_APP_STAGE;
var serverURL = "";
if (CurrentStage === "dev" || CurrentStage === "test") {
  serverURL = "//localhost:5000";
} else if (CurrentStage === "prod") {
  serverURL = "/api";
}

class PaintingHistory extends Component {
  constructor() {
    super();

    this.state = {
      displayMode: "grid",
      allRockData: [],
    };
  }

  componentDidMount() {
    console.log("painting history component mount");
    axios.get(`${serverURL}/rocks`).then((res) => {
      const prevPaintingData = res.data;
      this.setState({ allRockData: prevPaintingData });
    });
  }

  componentWillUnmount() {
    console.log("painting history component unmount");
  }

  render() {
    const mapRockHistory = this.state.allRockData
      .slice(0)
      .reverse()
      .map((rock) => {
        return (
          <div className="past-painting" key={rock.id}>
            <div className="past-painting__rock">
              <img
                src={rock.canvasImgData}
                alt={`Digital rock painting made by ${rock.painterName} on ${rock.lastModifiedDate}`}
              ></img>
              <img className="rock-overlay" src="https://assets.ard.northwestern.edu/files/2020/paint-the-rock/therock.svg"></img>
            </div>
            <div className="past-painting__painter-name">
              {rock.painterName}
            </div>
            <div className="past-painting__share">
            <Link className="past-paintings-btn" to={`/share-rock/${rock._id}`}>Share this painting</Link>
            </div>
          </div>
        );
      });

    return (
      <div className="painting-history">
        <h3>All past rocks</h3>
        <div
          className={`painting-history-list${
            this.state.displayMode === "grid" ? " grid" : ""
          }`}
        >
          {this.state.allRockData.length < 1 ? "Loading!" : mapRockHistory}
        </div>
      </div>
    );
  }
}

export default PaintingHistory;
