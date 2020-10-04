import React, { useState, useEffect } from "react";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import queryString, { parse } from "query-string";
import { Redirect, useLocation, useHistory } from "react-router-dom";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";

function Profile() {
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    email: "",
    tel: "",
    age: "",
    about: "",
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
    {
      name: "Tom Smith",
      email: "tom123@gmail.com",
    },
    {
      name: "Cindy Shi",
      email: "shi123@gmail.com",
    },
  ]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    console.log("deleting user...");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: localStorage.getItem("email"),
        auth_token: localStorage.getItem("auth_token"),
      },
    };

    fetch(API_URL + "/delete", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data !== "success") {
          alert("delete account failed!");
        }
      })
      .catch((err) => {
        alert("server can not delete account " + err);
      });

    //remove data in local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("email");

    //redirect to login page
    history.push("/login");
  };

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);

    let profile_email;
    if (
      Object.keys(parsed).length === 0 ||
      localStorage.getItem("email") === parsed.email
    ) {
      setIsOwnProfile(true);
      profile_email = localStorage.getItem("email");
    } else {
      setIsOwnProfile(false);
      profile_email = parsed.email;
    }

    console.log(profile_email);

    //check if user is logged in before fetching data from the server

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        profile_email: profile_email,
        email: localStorage.getItem("email"),
        auth_token: localStorage.getItem("auth_token"),
      },
    };

    fetch(API_URL + "/get_profile_page", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("request is ", data);
        if (data !== "failed" && !data.error) {
          setProfile({
            email: data.email,
            tel: data.phone_number == null ? "" : data.phone_number,
            age: data.age == null ? "" : data.age,
            about: data.about == null ? "" : data.about,
          });
          setName(data.name + " " + data.surname);
        } else if (data.error) {
          alert("Can not get profile!");
        } else {
          history.push("/login");
        }
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
