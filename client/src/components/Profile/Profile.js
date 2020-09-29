import React, { useState } from "react";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";

function Profile() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="profile">
      <ProfileHeader />
      <Container fluid>
        <Row>
          <Col md={4} sm={12}>
            <ProfileCard handleShow={handleShow} />
          </Col>
          <Col md={8} sm={12}>
            <ProfileInfo />
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
  );
}

export default Profile;
