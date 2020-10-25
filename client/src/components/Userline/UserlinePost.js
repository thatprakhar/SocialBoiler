import React from 'react'
import {Jumbotron, Button, Container, Badge, Col, Row, Image} from 'react-bootstrap'
import "./Userline.css"

function UserlinePost({username, title, description, image, date_created, likes, dislikes, topics, post_id}) {
    return (
       
            <Row>
                <Col md={12}>
                    <a href={"/posts_details?id="+post_id} style={{textDecoration: "none", color: "black"}}>
                        <Jumbotron>
                            <div className="post_header">
                                <h3>{title}</h3>
                                <div>
                                    <Badge variant="light">Posted by: {username}</Badge>
                                </div>
                                
                            </div>
                            
                            <p>
                                {description}
                            </p>

                            
                             {image!="null"?
                             (
                                <Image className="post_image" src={image} rounded />
                             ):
                             (null)}   
                            
                               
                            
                                
                           
                            <div className="post_footer">
                                <p className="post_badges">
                                    <Badge variant="info">{topics}</Badge>
                                    <Badge variant="primary">Likes: {likes}</Badge>
                                    <Badge variant="secondary">Dislikes: {dislikes}</Badge>
                                </p>
                                <div className="post_timestamp">
                                    <p>
                                        <Badge variant="light">Posted on: {date_created.split('.')[0]}</Badge>
                                    </p>
                                </div>
                               
                            </div>
                            
                        </Jumbotron>
                    </a>
                </Col>
            </Row>
            
            
        
    )
}

export default UserlinePost
