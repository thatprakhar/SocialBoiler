import React, { useState } from "react";
import { Nav, Navbar, Button, Form, FormControl } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Link } from "@material-ui/core";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";
function ProfileHeader() {
  const history = useHistory();
  const [topic, setTopic] = useState("");

  function searchByTopic(e) {
    e.preventDefault();
    if (topic === "") return;
    history.push({
      pathname: '/get_posts_by_topic',
      search: '?topic=' + topic
    })
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
      <div style={{display: "flex", flexDirection: "row"}}>
        <FormControl type="text" placeholder="Search by topic" className=" mr-sm-2" onChange={e => setTopic(e.target.value)}/>
        <Link href={"\get_posts_by_topic?topic=" + topic}>
          <Button type="submit">
            Search
          </Button>
        </Link>
       
      </div>
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>

          {localStorage.getItem("username") ? (
            <Nav.Link href="/profile">My Profile</Nav.Link>
          ) : null}
          {localStorage.getItem("username") ? (
            <Nav.Link href="/my_posts">My Posts</Nav.Link>
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
