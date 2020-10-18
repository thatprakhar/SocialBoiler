import React from "react";
import { Button } from "react-bootstrap";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";

function TopicItem({ name, unfollow, isOwnProfile ,setFollowing}) {
  const handleUnfollow=()=>{
    console.log('tab unfollowing', name);


    const requestOptions = {
      method: "POST",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        followed: name
      }
    };

    fetch(API_URL + "/unfollow", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("put request back is: ", data);
        if(data!=="success"){
          alert(data);
        }
        
        //update the following list in local storage
        let newFollowing=JSON.parse(localStorage.getItem("following")).filter((user)=>user!==name);
        localStorage.setItem("following", JSON.stringify(newFollowing))

        setFollowing(newFollowing)
        
      })
      .catch(err => {
        console.log("can not update profile: " + err);
        // setError("Can not connect to server!");
      });
    }
  return (
    <div className="profile__topic">
      <a href={"/profile?username=" + name}>{name}</a>

      {unfollow && isOwnProfile ? (
        <Button variant="info" onClick={handleUnfollow}>
          Unfollow
        </Button>
      ) : null}
    </div>
  );
}

export default TopicItem;
