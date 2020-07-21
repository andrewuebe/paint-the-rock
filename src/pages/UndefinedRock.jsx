import React, { Component } from "react";
import { Helmet } from "react-helmet";

const CurrentStage = process.env.REACT_APP_STAGE;
var serverURL = "";
if (CurrentStage === "dev" || CurrentStage === "test") {
  serverURL = "//localhost:5000";
} else if (CurrentStage === "prod") {
  serverURL = "/api";
}

var id;

class UndefinedRock extends Component {


  render() {
    return (
      <div className="painting-history">
        <h2 className="page-title">Whoops! It looks like this painting doesn't exist!</h2>
      </div>
    );
  }
}

export default UndefinedRock;
