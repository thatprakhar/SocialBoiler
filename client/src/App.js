import React from "react";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
            <Button component={Link} to="/createaccount" color="inherit">
              Create Account
            </Button>
            <Button color="inherit">Home</Button>
          </Toolbar>
        </AppBar>
        <Route path="/login" component={Login} />
        <Route path="/createaccount" component={CreateAccount}></Route>
      </Router>
    </div>
  );
}

export default App;
