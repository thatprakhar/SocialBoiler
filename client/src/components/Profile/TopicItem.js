import React from "react";
import { Button } from "react-bootstrap";

import "./Profile.css";

function TopicItem({ name, unfollow, isOwnProfile }) {
  return (
    <div className="profile__topic">
      <a href={"/profile?username=" + name}>{name}</a>

      {unfollow && isOwnProfile ? (
        <Button variant="info" onClick={() => unfollow(name)}>
          Unfollow
        </Button>
      ) : null}
    </div>
  );
}

export default TopicItem;
