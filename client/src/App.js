import React from "react";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const loggedIn = false;
  return (
    <div className="App">
      <Router>
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/createaccount" component={CreateAccount}></Route>
        <Route path="/forgotpass" component={ForgotPassword}></Route>
        <Route path="/profile" component={Profile}></Route>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
      </Router>
    </div>
  );
}

export default App;
