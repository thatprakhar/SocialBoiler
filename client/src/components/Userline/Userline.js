import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Badge,
  Alert
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import "./Userline.css";
import UserlinePost from "./UserlinePost";
import queryString from "query-string";
import ProfileHeader from "../Profile/ProfileHeader";

const API_URL = "http://127.0.0.1:5000";

let profile_user;

function Userline() {
  const [ownPosts, setOwnPosts] = useState([]);
  const [votedPosts, setVotedPosts] = useState([]);
  const [downVotedPosts, setDownVotedPosts]=useState([]);
  const [commentedPosts, setCommentedPosts]=useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading]=useState(true);
  const [error, setError] = useState(null);

  //get own posts
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    profile_user = parsed.username;
    console.log(profile_user);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/get_own_posts", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get own post request back is: ", data);
        if (data !== "failed") {
          setOwnPosts(data.sort((a, b) => b.post_id - a.post_id));
          setLoading(false);
          setError(null);
        } else {
          // alert(data);
          setError(data);
        }
      })
      .catch(err => {
        console.log("can not get own posts: " + err);
        setError("Can not connect to server!");
      });
  }, []);

  //get voted posts of the user
  useEffect(()=>{
    let parsed = queryString.parse(window.location.search);
    profile_user = parsed.username;
    console.log(profile_user);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    }

    //get like posts by user
    fetch(API_URL + "/get_liked_posts_by_user", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get like post request back is: ", data);
        if(data!=="failed"){
          setVotedPosts(data.sort((a, b) => b.post_id - a.post_id))
          setLoading(false)
          setError(null)

        }
        else {
          // alert(data);
          setError(data)
        }

      })
      .catch(err => {
        console.log("can not get liked posts: " + err);
        setError("Can not connect to server!");
      });

      //Get disliked posts
      fetch(API_URL + "/get_disliked_posts_by_user", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get dislike post request back is: ", data);
        if(data!=="failed"){
          setDownVotedPosts(data.sort((a, b) => b.post_id - a.post_id))
          setLoading(false)
          setError(null)

        }
        else {
          // alert(data);
          setError(data)
        }

      })
      .catch(err => {
        console.log("can not get dislike posts: " + err);
        setError("Can not connect to server!");
      });

  }, [])


  //get commented posts of the user
  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    profile_user = parsed.username;
    console.log(profile_user);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        profile_user: profile_user
      }
    };

    fetch(API_URL + "/get_commented_posts_by_user", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log("get commented post request back is: ", data);
        if (data !== "failed") {
          // setOwnPosts(data.sort((a, b) => b.post_id - a.post_id));
          // setLoading(false);
          // setError(null);

          let id_list=[];
          let data_list=[];
          for(let post of data){
            if(!id_list.includes(post.post_id)){
              data_list.push(post);
              id_list.push(post.post_id)
            }
          }
          console.log("data list is"+data_list);

          setCommentedPosts(data_list.sort((a,b)=>b.post_id-a.post_id));
          setCommentLoading(false);
          setError(null);

        } else {
          // alert(data);
          setError(data);
        }
      })
      .catch(err => {
        console.log("can not get commented posts: " + err);
        setError("Can not connect to server!");
      });
  }, []);
  
  return localStorage.getItem("username") ? (
    <div className={localStorage.getItem("theme")+"__userline"}>
      <ProfileHeader/>
      {loading ? (
        <div className="text-center" id="loader">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Container>
            <h1 className="header">
              <Badge variant="info">User Posts:</Badge>
            </h1>

            {ownPosts.length === 0 ? <h4>No posts yet...</h4> : null}

            {ownPosts.map(post => (
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

          <Container>
            <h1 className="header">
              <Badge variant="info">Liked Posts:</Badge>
            </h1>

            {votedPosts.length === 0 ? <h4>No liked posts yet...</h4> : null}

            {votedPosts.map(post => (
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
                isUserPosts={false}
                key={uuidv4()}
              />
            ))}
           
          </Container>

          <Container>
            <h1 className="header">
              <Badge variant="info">Disliked Posts:</Badge>
            </h1>

            {downVotedPosts.length === 0 ? <h4>No disliked posts yet...</h4> : null}

            {downVotedPosts.map(post => (
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
                isUserPosts={false}
                key={uuidv4()}
              />
            ))}
           
          </Container>


          <Container>
            <h1 className="header">
              <Badge variant="info">commented Posts:</Badge>
            </h1>

            {commentLoading?(
              <div>
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
            </div>
            )     
            :(
              <div>
                {commentedPosts.length === 0 ? <h4>No commented posts yet...</h4> : null}

                {commentedPosts.map(post => (
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
                    isUserPosts={false}
                    key={uuidv4()}
                  />
                ))}
              </div>

            )}

            
           
          </Container>
        </div>
      )}
    </div>
  ) : (
    <Redirect to="/login"></Redirect>
  );
}

export default Userline;
