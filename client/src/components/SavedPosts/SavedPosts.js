import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Badge,
  Alert
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./SavedPosts.css";
import UserlinePost from "../Userline/UserlinePost";
import ProfileHeader from "../Profile/ProfileHeader";

const API_URL = "http://127.0.0.1:5000";

let profile_user;

function SavedPosts() {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



useEffect(()=>{
    console.log("fetching the saved for "+localStorage.getItem("username"));

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: localStorage.getItem("username"),
      }
    };


    fetch(API_URL + "/all_bookmarked_posts", requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log("get saved post request back is: ", data);
      if (data !== "failed") {
        setSavedPosts(data.sort((a,b)=>b.post_id-a.post_id));
        setLoading(false);
        setError(null);
      } else {
        //alert(data);
        setError(data);
      }
    })
    .catch(err => {
      console.log("can not get saved posts: " + err);
      setError("Can not connect to server!");
    });


},[])

  return localStorage.getItem("username") ? (
    <div className={localStorage.getItem("theme")+"__userline"}>
      <ProfileHeader/>
      {loading ? (
        <div class="text-center" id="loader">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Container>
            <h1 className="header">
              <Badge variant="info">Saved Posts:</Badge>
            </h1>

            {savedPosts.length === 0 ? <h4>No posts yet...</h4> : null}

            {savedPosts.map(post => (
              <UserlinePost
                username={post.username}
                title={post.title}
                description={post.description}
                image={post.image}
                date_created={post.date_created}
                likes={post.likes}
                dislikes={post.dislikes}
                topics={post.topics}
                post_id={post.post_id}
                anonymous={post.anonymous}
                isUserPosts={true}
                key={uuidv4()}
              />
            ))}
          </Container>

         
        </div>
      )}
    </div>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}

export default SavedPosts;
