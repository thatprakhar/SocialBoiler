import React, { useState } from "react";
import { Form, Row, Col, Button, Tab, Tabs, Badge } from "react-bootstrap";
import TopicItem from "./TopicItem";
import { v4 as uuidv4 } from "uuid";

function ProfileInfo({ isOwnProfile }) {
  const [email, setEmail] = useState("pete124@purdue.edu");
  const [tel, setTel] = useState("123-456-7890");
  const [age, setAge] = useState("18");
  const [about, setAbout] = useState("Hi there 👋 , my name is Purdue Pete");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting form...");
    console.log(email, tel, age, about);
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
            <Form.Control plaintext readOnly value={email} />
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            Tel
          </Form.Label>
          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                plaintext
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            ) : (
              <Form.Control plaintext value={tel} readOnly />
            )}
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            Age
          </Form.Label>

          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                plaintext
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            ) : (
              <Form.Control plaintext value={age} readOnly />
            )}
          </Col>
          <Form.Label column sm="2" className="font-weight-bold">
            About Me
          </Form.Label>
          <Col sm="10">
            {isOwnProfile ? (
              <Form.Control
                as="textarea"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            ) : (
              <Form.Control as="textarea" value={about} readOnly />
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
            <TopicItem name={follower} key={uuidv4()} />
          ))}
        </Tab>
      </Tabs>
    </div>
  );
}

export default ProfileInfo;
