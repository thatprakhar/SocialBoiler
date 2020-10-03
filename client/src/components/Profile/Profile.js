import React, { useState, useEffect } from "react";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import queryString from "query-string";
import { Redirect, useLocation, useHistory } from "react-router-dom";

import "./Profile.css";

const API_URL = "https://jsonplaceholder.typicode.com/users/1";

function Profile() {
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const [name, setName] = useState("Purdue Pete");
  const [profile, setProfile] = useState({
    email: "pete124@purdue.edu",
    tel: "123-456-7890",
    age: "18",
    about: "Hi there 👋 , my name is Purdue Pete",
  });

  const [topics, setTopics] = useState([
    "#purdue",
    "#computer science",
    "#React",
  ]);
  const [following, setFollowing] = useState([
    "Roopsha Samanta",
    "Jeffrey A. Turkstra",
    "Gustavo Rodriguez-Rivera",
  ]);

  const [followers, setFollowers] = useState([
    "Cindy",
    "Onur",
    "Uras",
    "Sayed",
    "Prakhar",
  ]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    console.log("deleting user...");
    const requestOptions = {
      method: "DELETE",
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {})
      .catch((err) => {
        alert("server can not delete account " + err);
      });

    //remove data in local storage
    localStorage.removeItem("user");

    //redirect to login page
    history.push("/login");
  };

  useEffect(() => {
    //check if user is logged in before fetching data from the server

    const requestOptions = {
      method: "GET",
    };

    fetch(API_URL, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("request is ", data);
        setProfile({
          email: data.email,
          tel: data.phone,
          age: data.id,
          about: data.website,
        });
        setName(data.name);
      })
      .catch((err) => {
        alert("Could not connect to server" + err);
      });
  }, []);

  //check if user is logged in

  return (
    <div className="profile">
      <ProfileHeader />
      <Container fluid>
        <Row>
          <Col md={4}>
            <ProfileCard
              handleShow={handleShow}
              isOwnProfile={isOwnProfile}
              name={name}
            />
          </Col>

          <Col md={8}>
            <ProfileInfo
              isOwnProfile={isOwnProfile}
              topics={topics}
              following={following}
              followers={followers}
              profile={profile}
              setProfile={setProfile}
              setTopics={setTopics}
              setFollowing={setFollowing}
            />
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
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
