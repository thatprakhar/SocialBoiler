import React, {useState} from 'react'
import {
    Redirect,
  } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    ButtonGroup,
    Badge,
    Alert
  } from "react-bootstrap";
  import "./Userline.css"
  import ProfileHeader from '../Profile/ProfileHeader'
  import UserlinePost from './UserlinePost'

  


function Userline() {
  const [ownPosts, setOwnPosts]=useState([
    {
      username: "cindy",
      title: "Hello World!",
      description: "This is a post, how does it look?",
      image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip",
      date_created: "2020-10-23",
      likes: 3,
      dislikes: 4,
      topics: "random"
    },
    {
      username: "cindy",
      title: "Hello World!",
      description: "This is a post, how does it look?",
      image: null,
      date_created: "2020-10-23",
      likes: 3,
      dislikes: 4,
      topics: "random"
    },
    {
      username: "cindy",
      title: "Hello World!",
      description: "This is a post, how does it look?",
      image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip",
      date_created: "2020-10-23",
      likes: 3,
      dislikes: 4,
      topics: "random"
    },
  ]);
  const [votedPosts, setVotedPosts]=useState([]);


    return localStorage.getItem("username")?
    (
    <div>
        <ProfileHeader/>
        <Container>
          <h1 className="header">
              <Badge variant="info">User Posts:</Badge>
          </h1>

          {ownPosts.map(post=>(
              <UserlinePost 
                username={post.username}
                title={post.title}
                description={post.description}
                image={post.image}
                date_created={post.date_created}
                likes={post.likes}
                dislikes={post.dislikes}
                topics={post.topics}
              />
              )
          )}
            
        </Container>

        <Container>
          <h1 className="header">
              <Badge variant="info">Voted Posts:</Badge>
          </h1>

          {ownPosts.map(post=>(
              <UserlinePost 
                username={post.username}
                title={post.title}
                description={post.description}
                image={post.image}
                date_created={post.date_created}
                likes={post.likes}
                dislikes={post.dislikes}
                topics={post.topics}
              />
              )
          )}
        </Container>
      
    </div>
    
    ):
    (
        <Redirect to="/login"></Redirect>
    )
    
}

export default Userline

