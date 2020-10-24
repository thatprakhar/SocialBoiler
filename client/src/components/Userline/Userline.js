import React from 'react'
import {
    Redirect,
  } from "react-router-dom";
  import {
    makeStyles,
    Avatar,
    Typography,
    IconButton,
    Link,
    Hidden,
    Button
  } from "@material-ui/core";
  import {
    Container,
    Row,
    Col,
    ButtonGroup,
    Badge,
    Alert
  } from "react-bootstrap";
  import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
  import ThumbDownIcon from "@material-ui/icons/ThumbDown";
  import CommentIcon from "@material-ui/icons/Comment";
  import CloseIcon from "@material-ui/icons/Close";
  import BookmarkIcon from "@material-ui/icons/Bookmark";

  const styling = makeStyles(theme => ({
    root: {
      marignLeft: 10,
      background: "white",
      borderRadius: 10,
      width: "100vw",
      maxHeight: window.innerHeight
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    },
    body: {
      marginTop: 5
    },
    profile: {
      marginTop: 10,
      display: "flex",
      flexDirection: "row"
    },
    userline: {
      marginLeft: 10,
      marginTop: 5
    },
    endline: {
      display: "flex",
      flexDirection: "row"
    },
    purple: {
      background: "black"
    },
    closeButton: {
      position: "fixed",
      right: -5
    }
  }));

function Userline(props) {

    return localStorage.getItem("username")?
    (
       
        <Container className={styling.root}>
      <Hidden mdUp>
        <Button
          color="secondary"
          
          className={styling.closeButton}
        >
          <CloseIcon />
        </Button>
        <br />
      </Hidden>

      <Row>
        <Col lg={true}>
          <Typography variant="h4">Title</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6">
              {/* <a href={"/get_posts_by_topic?topic=" + props.post_data.topic}>
                <Badge variant="dark" type="link">
                  {props.post_data.topic}
                </Badge>
              </a> */}
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Avatar className={styling.small && styling.purple}>
                {/* {props.post_data.username[0]} */}
                name
              </Avatar>
              <Link
                // href={"profile?username=" + props.post_data.userName}
                color="inherit"
              >
                <Typography variant="body1" className={styling.userline}>
                  {/* {props.post_data.userName} */}
                </Typography>
              </Link>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
          {/* <Typography variant="body1">{props.post_data.description}</Typography> */}
          <Typography variant="body1">description</Typography>
        </Col>
      </Row>

     
      <br />
      
    </Container>
    ):
    (
        <Redirect to="/login"></Redirect>
    )
    
}

export default Userline

