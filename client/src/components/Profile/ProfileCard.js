import React, { useEffect } from "react";
import { Card, Button, Badge } from "react-bootstrap";

function ProfileCard({ handleShow, isOwnProfile, name }) {
  return (
    <div className="profile__card">
      <Card style={{ width: "30rem", height: "40rem" }}>
        <Card.Img
          variant="top"
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn.fansided.com%2Fwp-content%2Fblogs.dir%2F229%2Ffiles%2F2013%2F11%2F6896948.jpg&f=1&nofb=1"
        />
        <Card.Body>
          <h1>
            <Badge variant="light">{name}</Badge>
          </h1>

          <h5>
            <Badge variant="info">Followers:</Badge> 5
          </h5>
          <h5>
            <Badge variant="warning">Following:</Badge> 3
          </h5>
          <h5>
            <Badge variant="success">Topics:</Badge> 3
          </h5>
          <h5>
            <Badge variant="primary">Posts:</Badge> 10
          </h5>
          <div className="text-center profile__delete">
            {isOwnProfile ? (
              <Button variant="danger" onClick={handleShow}>
                Delete Account
              </Button>
            ) : (
              <Button variant="info">Follow</Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProfileCard;
