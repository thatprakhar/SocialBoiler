import React from "react";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import Profile from "./components/Profile/Profile";
import NotFound from "./components/NotFound/NotFound";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  let user = localStorage.getItem("user");
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/createaccount" component={CreateAccount}></Route>
          <Route path="/forgotpass" component={ForgotPassword}></Route>
          <Route path="/profile" component={Profile}></Route>
          <Route exact path="/">
            {user !== "" ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="*" component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
