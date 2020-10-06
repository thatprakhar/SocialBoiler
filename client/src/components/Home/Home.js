import React from "react";
import Login from "../Login/Login";
import { Button } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

export default function Home() {
  const API_URL = "http://127.0.0.1:5000";
  const history = useHistory();
  function logout() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: localStorage.getItem("email"),
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
      },
    };
    fetch(API_URL + "/logout", requestOptions)
      .then((res) => {})
      .catch((err) => console.log(err));
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    history.push("/login");
  }

  function goToProfile() {
    history.push("/profile");
  }

  return (
    <div>
      <Router>
        <Route path="/login" component={Login}></Route>
        <Route exact path="/home">
          {localStorage.getItem("auth_token") ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Router>
      <h1>Home</h1>
      <Button variant="contained" color="primary" onClick={goToProfile}>
        Profile
      </Button>
      <Button variant="contained" color="secondary" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
