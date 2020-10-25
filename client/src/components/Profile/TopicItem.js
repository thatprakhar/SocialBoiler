import React from "react";
import { Button } from "react-bootstrap";

import "./Profile.css";

const API_URL = "http://127.0.0.1:5000";

function TopicItem({ name, unfollow, isOwnProfile ,setFollowing, isTopic, setTopics}) {
  const handleUserUnfollow=()=>{
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

  const handleTopicUnfollow=()=>{
    console.log("unfollowing topic...")
    const requestOptions = {
      method: "POST",

      headers: {
        "Content-type": "application/json; charset=UTF-8",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        topic: name
      }
    };


    fetch(API_URL + "/unfollow_topic", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("unfollow topic request back is: ", data);
        if(data!=="success"){
          alert(data);
        }
        //update the following topic in local storage
        let newFollowing=JSON.parse(localStorage.getItem("topic")).filter((topic)=>topic!==name);
        localStorage.setItem("topic", JSON.stringify(newFollowing))

        setTopics(newFollowing)

      })
      .catch(err => {
        console.log("can not unfollow topic: " + err);
        // setError("Can not connect to server!");
      });


  }
  return (
    <div className="profile__topic">
      <a href={isTopic?("/get_posts_by_topic?topic="+name):("/profile?username=" + name)}>{name}</a>

      {unfollow && isOwnProfile ? (
        <Button variant="info" onClick={isTopic?(handleTopicUnfollow):(handleUserUnfollow)}>
          Unfollow
        </Button>
      ) : null}
    </div>
  );
}

export default TopicItem;
