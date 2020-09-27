import React from "react";
import Login from "./Login";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Consumer, { ConfigProvider } from "../configContext";
export default function Home(props) {
  return (
    <div>
      {/* <Router>
        <Route path="/login" component={Login}></Route>
        <Route exact path="/home">
          {ConfigProvider.userloggedIn ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Router> */}
      {localStorage.getItem("userLoggedIn") == "true" ? (
        <h1>Home</h1>
      ) : (
        <Redirect to="/login" />
      )}
    </div>
  );
}
