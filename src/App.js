import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, OperatorViewer, ClinicianViewer, Redirect } from "./components";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Login />} />
          <Route path="/viewer" exact component={() => <OperatorViewer />} />
          <Route path="/clinicianviewer" exact component={() => <ClinicianViewer />} />
          <Route path="/redirect" exact component={() => <Redirect />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
