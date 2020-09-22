import React from "react";
import { Button } from "react-bootstrap";

import "./Profile.css";

function TopicItem({ name, unfollow }) {
  return (
    <div className="profile__topic">
      <a href="/">{name}</a>

      {unfollow ? (
        <Button variant="info" onClick={() => unfollow(name)}>
          Unfollow
        </Button>
      ) : null}
    </div>
  );
}

export default TopicItem;
