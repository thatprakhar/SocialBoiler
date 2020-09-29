import React, { useState } from "react";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Consumer from "../configContext";

import "./Profile.css";

function Profile() {
  const [show, setShow] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // let query = queryString.parse(useLocation().search);
  // console.log(query);

  return (
    <Consumer>
      {(context) => {
        //console.log("here", localStorage.getItem("userLoggedIn"));
        return localStorage.getItem("userLoggedIn") == "true" ? (
          <div className="profile">
            <ProfileHeader />
            <Container fluid>
              <Row>
                <Col md={4}>
                  <ProfileCard
                    handleShow={handleShow}
                    isOwnProfile={isOwnProfile}
                  />
                </Col>

                <Col md={8}>
                  <ProfileInfo isOwnProfile={isOwnProfile} />
                </Col>
              </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure to delete your account?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={handleClose}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        ) : (
          <button onClick={context.toggleLogin}>login</button>
        );
      }}
    </Consumer>
  );
}

export default Profile;
