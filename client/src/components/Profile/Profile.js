import React, { useState, useEffect } from "react";
import { Col, Container, Row, Modal, Button, Alert } from "react-bootstrap";
import ProfileCard from "./ProfileCard";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";

let profile_user;

function Profile() {
  const history = useHistory();

  const [showDelete, setShowDelete] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [error, setError] = useState(null);

  const [file, setFile] = useState("");
  const [image, setImage] = useState("");

  const [name, setName] = useState("");
  const [profile, setProfile] = useState({
    email: "",
    tel: "",
    age: "",
    about: ""
  });

  const [topics, setTopics] = useState([]);
  const [following, setFollowing] = useState([]);

  const [followers, setFollowers] = useState([]);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = () => setShowDelete(true);

  const handleUploadClose = () => setShowUpload(false);
  const handleUploadShow = () => setShowUpload(true);

  async function readImage(file) {
    // Check if the file is an image.
    if (file.type && file.type.indexOf("image") === -1) {
      console.log("File is not an image.", file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", event => {
      // console.log("readinf image:", event.target.result);
      const requestOptions = {
        method: "POST",

        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          image: event.target.result
        }
      };

      fetch(API_URL + "/update_profile_avatar", requestOptions)
        .then(res => res.json())
        .then(data => {
          console.log("put request back is: ", data);
          // alert(data);
        })
        .catch(err => {
          console.log("can not update image: " + err);
          setError("Can not upload image!");
        });
      setImage(event.target.result);
    });
    reader.readAsDataURL(file);
  }

  const handleUpload = () => {
    console.log("uploading...");
    if (!file || !file[0]) {
      return;
    }

    // console.log("######frontedn image sent is:######", image);
    readImage(file[0]);
    setShowUpload(false);
  };

  const handleDelete = () => {
    console.log("deleting user...");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token")
      }
    };

    fetch(API_URL + "/delete", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data !== "success") {
          // alert("delete account failed!");
          setError("delete account failed");
        }
      })
      .catch(err => {
        alert("server can not delete account " + err);
      });

    //remove data in local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("topic")
    localStorage.removeItem("following")

    //redirect to login page
    history.push("/login");
  };

  useEffect(() => {
    //Check if the user is logged in
    if (localStorage.getItem("username") != null) {
      setIsLoggedIn(true);
    }
    let parsed = queryString.parse(window.location.search);

    if (
      Object.keys(parsed).length === 0 ||
      localStorage.getItem("username") === parsed.username
    ) {
      setIsOwnProfile(true);
      profile_user = localStorage.getItem("username");
    } else {
      setIsOwnProfile(false);
      profile_user = parsed.username;
    }

    console.log(profile_user);

    //If user is not logged in and want to access own profile, return to login page
    if (localStorage.getItem("username") == null && parsed.username == null) {
      console.log("here");
      history.push("/login");
      return;
    }

    //check if user is logged in before fetching data from the server

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/get_profile_page", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("request is ", data);
        if (data !== "failed" && !data.error) {
          setProfile({
            email: data.email,
            tel: data.phone_number == null ? "" : data.phone_number,
            age: data.age == null ? "" : data.age,
            about: data.about == null ? "" : data.about
          });
          setName("@" + data.username);
          setImage(data.image);
        } else if (data.error) {
          // alert("Can not get profile!");
          //setError("Can not get user profile! User doesn't exists!");
          history.push("/404");
        } else {
          history.push("/login");
        }
      })
      .catch(err => {
        // alert("Could not connect to server" + err);
        setError("Can not connect to server!");
      });
  }, [history]);

  useEffect(() => {
    //Get the followers and following info
    console.log("profile user is " + profile_user);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/followers", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("follwers request back is: ", data);
        if (data !== "failed") {
          console.log(data);
          if (data != null) {
            setFollowers(data);
          }
        } else {
          setError("Can not get followers!");
        }
      })
      .catch(err => {
        console.log("can not update profile: " + err);
        setError("Can not connect to server!");
      });
  }, []);

  useEffect(() => {
    //Get the followers and following info
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/following", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("following request back is: ", data);
        if (data !== "failed") {
          console.log(data);
          if (data != null) {
            setFollowing(data);
            if (profile_user === localStorage.getItem("username")) {
              localStorage.setItem("following", JSON.stringify(data));
            }
          }
        } else {
          setError("Can not get following users!");
        }
      })
      .catch(err => {
        console.log("can not update profile: " + err);
        setError("Can not connect to server!");
      });
  }, []);

  useEffect(() => {
    //Get the the topics the profile user is following
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/user_topics", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get topics request back is: ", data);
        setTopics(data);
        if (profile_user === localStorage.getItem("username")) {
          localStorage.setItem("topic", JSON.stringify(data));
        }
      })
      .catch(err => {
        console.log("can not get following topics: " + err);
        setError("Can not connect to server!");
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
              handleDeleteShow={handleDeleteShow}
              handleUploadShow={handleUploadShow}
              isOwnProfile={isOwnProfile}
              name={name}
              image={image}
              profileUser={queryString.parse(window.location.search).username}
              followers={followers}
              setFollowers={setFollowers}
              following={following}
              setFollowing={setFollowing}
              topics={topics}
            />
            <div className="userline__box">
              {isLoggedIn ? (
                <div className="userline__link">
                  <a href={"/userline?username=" + profile_user}>
                    Go to Userline
                  </a>
                </div>
              ) : null}
            </div>
          </Col>

          <Col md={8}>
            {error != null ? (
              <Alert variant="danger" style={{ marginTop: "20px" }}>
                {error}
              </Alert>
            ) : null}

            <ProfileInfo
              isOwnProfile={isOwnProfile}
              topics={topics}
              following={following}
              followers={followers}
              profile={profile}
              setProfile={setProfile}
              setTopics={setTopics}
              setFollowing={setFollowing}
              setError={setError}
            />
          </Col>
        </Row>
      </Container>

      <Modal show={showDelete} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpload} onHide={handleUploadClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={e => setFile(e.target.files)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUploadClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
