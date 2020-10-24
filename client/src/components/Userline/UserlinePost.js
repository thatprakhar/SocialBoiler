import React from 'react'
import {Jumbotron, Button, Container, Badge, Col, Row, Image} from 'react-bootstrap'
import "./Userline.css"

function UserlinePost({username, title, description, image, date_created, likes, dislikes, topics}) {
    return (
       
            <Row>
                <Col md={12}>
                    <a href="/posts_details?id=123" style={{textDecoration: "none", color: "black"}}>
                        <Jumbotron>
                            <p className="post_header">
                                <h3>{title}</h3>
                                <div>
                                    <Badge variant="light">Posted by: {username}</Badge>
                                </div>
                                
                            </p>
                            
                            <p>
                                {description}
                            </p>

                            
                             {image?
                             (
                                <Image className="post_image" src={image} rounded />
                             ):
                             (null)}   
                            
                               
                            
                                
                           
                            <p className="post_footer">
                                <p className="post_badges">
                                    <Badge variant="info">{topics}</Badge>
                                    <Badge variant="primary">Likes: {likes}</Badge>
                                    <Badge variant="secondary">Dislikes: {dislikes}</Badge>
                                </p>
                                <p className="post_timestamp">
                                    <Badge variant="light">Posted on: {date_created}</Badge>
                                </p>
                            </p>
                            
                        </Jumbotron>
                    </a>
                </Col>
            </Row>
            
            
        
    )
}

export default UserlinePost
