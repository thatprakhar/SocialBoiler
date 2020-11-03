import React from "react";
import {
  Jumbotron,
  Badge,
  Col,
  Row,
  Image
} from "react-bootstrap";
import "./Userline.css";

function UserlinePost({
  username,
  title,
  description,
  image,
  date_created,
  likes,
  dislikes,
  topics,
  post_id,
  anonymous,
  isUserPosts,
}) {
  let displayName;
  if(anonymous==="true" && localStorage.getItem("username")!==username && !isUserPosts){
    displayName=<Badge variant="light">Posted by: Anonymous</Badge>;
  }
  else if(anonymous=="true" && localStorage.getItem("username")!==username && isUserPosts){
    displayName=null;
  }
  else if(anonymous=="true" && localStorage.getItem("username")==username){
    displayName=<Badge variant="light">Posted by: {username} (Anonymous to others)</Badge>;
  }
  else {
    displayName=<Badge variant="light">Posted by: {username}</Badge>;
  }
  return (
    displayName?(
      <Row>
      <Col md={12}>
        <a
          href={"/posts_details?id=" + post_id}
          style={{ textDecoration: "none", color: "black" }}
        >
          <Jumbotron >
            <div className="post_header">
              <h3>{title}</h3>
              <div>
                {displayName}
                
              </div>
            </div>

            <p className="post_text">{description}</p>  

            {image != "null" ? (
              <Image className="post_image" src={image} rounded />
            ) : null}

            <div className="post_footer">
              <p className="post_badges">
                <Badge variant="info">{topics}</Badge>
                <Badge variant="primary">Likes: {likes}</Badge>
                <Badge variant="secondary">Dislikes: {dislikes}</Badge>
              </p>
              <div className="post_timestamp">
                <p>
                  <Badge variant="light">
                    Posted on: {date_created.split(".")[0]}
                  </Badge>
                </p>
              </div>
            </div>
          </Jumbotron>
        </a>
      </Col>
    </Row>
    ):(
      null
    )
    
  );
}

export default UserlinePost;
