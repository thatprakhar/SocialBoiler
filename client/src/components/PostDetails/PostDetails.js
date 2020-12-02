import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Badge,
  Alert
} from "react-bootstrap";
import queryString from 'query-string';
import "./PostDetails.css";
import UserlinePost from "../Userline/UserlinePost";
import ProfileHeader from '../Profile/ProfileHeader';

const API_URL = "http://127.0.0.1:5000";


function PostDetails() {
  const [post, setPost] = useState({});
  const [comments, setComments]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  //Get post body
  useEffect(()=>{
    console.log("fetching post detail for "+localStorage.getItem("username"));
    let post_id = queryString.parse(window.location.search).id;
    console.log("post id is"+post_id);

    //get the post detail by id
    const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          auth_token: localStorage.getItem("auth_token"),
          username: localStorage.getItem("username"),
          post_id: post_id
        }
    };

    fetch(API_URL + "/get_post_by_id", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get post id back is: ", data);
        if (data !== "failed" && data.length!=0) {
          setPost(data[0])
          setLoading(false);
          setError(null);
        } else {
        //   alert(data);
          setError("Invalid post id!");
          setLoading(false)
          
        }
      })
      .catch(err => {
        console.log("can not get post details: " + err);
        setError("Can not get post id! Invalid post id or server is down!");
        setLoading(false)
      });
},[])

//get post comments
useEffect(()=>{
  console.log("fetching post comment for "+localStorage.getItem("username"));
  let post_id = queryString.parse(window.location.search).id;
  console.log("post id is"+post_id);

  //get the post comments by id
  const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        post_id: post_id
      }
  };

  fetch(API_URL + "/get_commented_post_by_id", requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log("get post comments back is: ", data);
      if (data !== "failed") {
        setComments(data.sort((a,b)=>b.id-a.id))
        // setLoading(false);
        setError(null);
        
      } else {
        alert(data);
        setError("Invalid post id!");
        // setLoading(false)
        
      }
    })
    .catch(err => {
      console.log("can not get post comments: " + err);
      setError("Can not get post comments! Invalid post id or server is down!");
      setLoading(false)
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
          
        <div className="post_container">
          {error ? <Alert variant="danger" className="text-center">{error}</Alert> : (
              <Container>
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
                    isPostDetails={true}
                    comments={comments}
                />
          </Container>
          )}
          

         
        </div>
      )}
    </div>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}

export default PostDetails;