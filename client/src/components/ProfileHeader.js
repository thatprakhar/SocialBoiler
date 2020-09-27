import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import Consumer from "../configContext";

import "./Profile.css";

function ProfileHeader() {
  return (
    <Consumer>
      {(context) => {
        return (
          <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
            <Navbar.Brand href="/home">SocialBoiler</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="#link">Posts</Nav.Link>
                <Button variant="info" onClick={context.toggleLogin}>
                  Logout
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        );
      }}
    </Consumer>
  );
}

export default ProfileHeader;
