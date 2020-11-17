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
  Switch
} from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Userline from "./components/Userline/Userline";
import SavedPosts from './components/SavedPosts/SavedPosts'

function App() {
  return (
    <div className={"App"+" "+localStorage.getItem("theme")}>
      <Router>
        <Switch>
          <Route path="/home">
            <Home page_type="home"></Home>
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path="/createaccount" component={CreateAccount}></Route>
          <Route exact path="/forgotpass" component={ForgotPassword}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <Route exact path="/userline" component={Userline}></Route>
          <Route exact path="/saved_posts" component={SavedPosts}></Route>
          <Route exact path={"/get_posts_by_topic"}>
            <Home page_type="search_posts"></Home>
          </Route>
          <Route exact path="/my_posts">
            <Home page_type="my_posts"></Home>
          </Route>
          <Route exact path="/">
            {localStorage.getItem("auth_token") ? (
              <Redirect to="/home" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route exact path="*" component={NotFound}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
