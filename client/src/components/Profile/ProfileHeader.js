import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import "./Profile.css";

function ProfileHeader() {
  const history = useHistory();
  const logout = () => {
    localStorage.removeItem("user");
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
          <Button variant="info" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ProfileHeader;
