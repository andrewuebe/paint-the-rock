import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PaintTheRock from "./pages/PaintTheRock";
import ShareRock from "./pages/ShareRock";
import PaintingHistory from "./pages/PaintingHistory";
import "./App.css";

// App component
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/painting-history" component={PaintingHistory} />
          <Route path="/share-rock/:id" component={ShareRock} />
          <Route path="/" component={PaintTheRock} />
        </Switch>
      </Router>
    );
  }
}

export default App;
