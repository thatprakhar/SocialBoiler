import React, { useEffect, useState } from "react";
import { Nav, Navbar, Button, FormControl } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { Link, Switch, FormControlLabel } from "@material-ui/core";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";
function ProfileHeader(props) {
  const history = useHistory();
  const [topic, setTopic] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'Light');
  useEffect(() => {

  }, [theme])

  function changeTheme() {
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') === 'Light') {
        localStorage.setItem('theme', 'Dark');
      } else {
        localStorage.setItem('theme', 'Light');
      }
    } else {
      localStorage.setItem('theme', 'Dark');
    }
    setTheme(localStorage.getItem('theme'));
    window.location.reload(false);
  }

  const handleLogOut = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: localStorage.getItem("email"),
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username")
      }
    };

    fetch(API_URL + "/logout", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        alert("can not logout: " + err);
      });
    //redirect to login page
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("following");
    localStorage.removeItem("topic");

   
    history.push("/login");
  };
  return (
    
    <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
      <Navbar.Brand href="/home">SocialBoiler</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {localStorage.getItem("username")?(
          <div style={{ display: "flex", flexDirection: "row" }}>
          <FormControl
            type="text"
            placeholder="Search by topic"
            className=" mr-sm-2"
            onChange={e => setTopic(e.target.value)}
          />
          <Link href={topic.trim() !== '' ? "get_posts_by_topic?topic=" + topic : ''}>
            <Button type="submit">Search</Button>
          </Link>
        </div>
        ):(
          null
        )}
        <Nav className="ml-auto">
          <FormControlLabel 
          className="theme-switch"
          control={
            <Switch color="primary" checked={theme === 'Light' ? false : true}/>
          } label={theme} 
          onChange={() => changeTheme()}
          />
          {localStorage.getItem("username") ? 
            <Nav.Link href="/">Home</Nav.Link> 
            : null}
          {localStorage.getItem("username") ? (
            <Nav.Link href="/my_posts">My Posts</Nav.Link>
          ) : null}
          {localStorage.getItem("username") ? (
            <Nav.Link href="/profile">My Profile</Nav.Link>
          ) : null}
          {localStorage.getItem("username") ? (
            <Nav.Link href="/saved_posts">Saved Posts</Nav.Link>
          ) : null}
          {localStorage.getItem("username") ? (
            <Button variant="info" onClick={handleLogOut}>
              Logout
            </Button>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ProfileHeader;
