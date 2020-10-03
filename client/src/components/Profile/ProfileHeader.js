import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "./Profile.css";

const API_URL = "https://jsonplaceholder.typicode.com/users/1";
function ProfileHeader() {
  const history = useHistory();
  const handleLogOut = () => {
    //remove user from localstorage
    localStorage.removeItem("user");
    //remove token from server
    const requestOptions = {
      method: "POST",
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert("can not logout: " + err);
      });
    //redirect to login page
    history.push("/login");
  };
  return (
    <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
      <Navbar.Brand href="/home">SocialBoiler</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="#link">Posts</Nav.Link>
          <Button variant="info" onClick={handleLogOut}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ProfileHeader;
