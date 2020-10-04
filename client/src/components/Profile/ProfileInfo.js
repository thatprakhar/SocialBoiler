import React from "react";
import { Form, Row, Col, Button, Tab, Tabs, Badge } from "react-bootstrap";
import TopicItem from "./TopicItem";
import { v4 as uuidv4 } from "uuid";

const API_URL = "http://127.0.0.1:5000";

function ProfileInfo({
  isOwnProfile,
  topics,
  following,
  followers,
  profile,
  setProfile,
  setTopics,
  setFollowing,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting form...");
    console.log(profile.email, profile.tel, profile.age, profile.about);

    //check if fields are correct
    if (!profile.age.toString().match(/^\d*$/g)) {
      alert("age must be a number");
      return;
    }

    if (
      !profile.tel
        .toString()
        .trim()
        .match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/g)
    ) {
      alert("Phone number must be in the format: xxx-xxx-xxxx");
      return;
    }

    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        email: profile.email,
        tel: profile.tel,
        age: profile.age,
        about: profile.about,
      }),

      headers: {
        "Content-type": "application/json; charset=UTF-8",
        email: profile.email,
        auth_token: localStorage.getItem("auth_token"),
        tel: profile.tel,
        age: profile.age,
        about: profile.about,
      },
    };

    fetch(API_URL + "/update_profile_page", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("put request back is: ", data);
        alert("update profile success!");
      })
      .catch((err) => {
        console.log("can not update profile: " + err);
      });
  };

  const unfollowTopic = (topicName) => {
    setTopics((prevTopics) => {
      return prevTopics.filter((topic) => topic !== topicName);
    });
  };

  const unfollowUser = (userName) => {
    setFollowing((prevFollowing) => {
      return prevFollowing.filter((user) => user !== userName);
    });
  };
  return (
    <div className="profile__info">
      <h2>
        <Badge variant="secondary">Profile:</Badge>
      </h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="formPlaintextIntro">
          <Form.Label column sm="2" className="font-weight-bold">
            Email:
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly value={profile.email} />
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            Tel
          </Form.Label>
          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                plaintext
                value={profile.tel}
                onChange={(e) =>
                  setProfile({ ...profile, tel: e.target.value })
                }
                placeholder={"phone number: xxx-xxx-xxxx"}
              />
            ) : (
              <Form.Control plaintext value={profile.tel} readOnly />
            )}
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            Age
          </Form.Label>

          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                plaintext
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
                placeholder={"age: must be a number"}
              />
            ) : (
              <Form.Control plaintext value={profile.age} readOnly />
            )}
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            About Me
          </Form.Label>
          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                as="textarea"
                value={profile.about}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
                placeholder={"Tell us about yourself"}
              />
            ) : (
              <Form.Control as="textarea" value={profile.about} readOnly />
            )}
          </Col>
        </Form.Group>
        {isOwnProfile ? (
          <div className="text-right">
            <Button type="submit" variant="info">
              Update Profile
            </Button>
          </div>
        ) : null}
      </Form>
      <Tabs
        defaultActiveKey="topics"
        id="uncontrolled-tab-example"
        className="profile__tabs"
      >
        <Tab eventKey="topics" title="Following topics">
          {topics.map((topic) => (
            <TopicItem
              name={topic}
              unfollow={unfollowTopic}
              key={uuidv4()}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </Tab>
        <Tab eventKey="users" title="Following users">
          {following.map((user) => (
            <TopicItem
              name={user}
              unfollow={unfollowUser}
              key={uuidv4()}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </Tab>
        <Tab eventKey="followers" title="Followers">
          {followers.map((follower) => (
            <TopicItem
              name={follower.name}
              email={follower.email}
              key={uuidv4()}
            />
          ))}
        </Tab>
      </Tabs>
    </div>
  );
}

export default ProfileInfo;
