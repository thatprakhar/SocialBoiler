import React from "react";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import NotFound from "./components/NotFound";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import "./App.css";

import { ConfigProvider } from "./configContext";

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <Router>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/createaccount" component={CreateAccount}></Route>
            <Route path="/forgotpass" component={ForgotPassword}></Route>
            <Route exact path="/">
              {ConfigProvider.userLoggedIn ? (
                <Redirect to="/home" />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route exact path="*" component={NotFound}></Route>
          </Switch>
        </Router>
      </ConfigProvider>
    </div>
  );
}

export default App;
