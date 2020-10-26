import React, { useState } from "react";
import {
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Snackbar
} from "@material-ui/core";
import { Button, Badge, Alert } from "react-bootstrap";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";



const createStyles = makeStyles(theme => ({
  inline: {
    display: "inline"
  },
  post: {
    marginTop: 50,
    width: "100%"
  },
  root: {
    position: "relative",
    overflow: "auto",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    maxHeight: window.innerHeight,
    maxWidth: "50ch"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
  notif: {
    zIndex: theme.zIndex.drawer + 1,
    position: "absolute"
  }
}));

export default function App(props) {
  var styling = createStyles();
  const [loading, setLoading] = useState(false);
  const [showSuccessFollow, setShowSuccessFollow] = useState(false);
  const [showError, setShowError] = useState(false);
  

  const API_URL = "http://127.0.0.1:5000";

  function parentHandle(post_data) {
    props.parentHandler(post_data);
  }

  function followTopic() {
    setLoading(true);
    const requestOptions = {
      method: "POSt",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        topic: props.topic
      }
    };
    fetch(API_URL + "/follow_topic", requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data === "failed") {
        setShowError(true); 
      } else {
        setShowSuccessFollow(true);
      }
      setLoading(false);
    })
    .catch(err => {
      console.log(err)
      setLoading(false);
    });
  }

  function post_view(post_data) {
    return (
      <Button style={{width: "100%"}} variant="light" onClick={() => parentHandle(post_data)}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar
              alt={post_data.userName}
              src="/static/images/avatar/1.jpg"
            />
          </ListItemAvatar>
          <ListItemText
            primary={post_data.title}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={styling.inline}
                  color="textPrimary"
                >
                  {post_data.username} -{" "}
                </Typography>
                {post_data.description.substr(0, 120)}
                {"..."}
                <Badge variant="dark">{post_data.topics}</Badge>
              </React.Fragment>
            }
          />
        </ListItem>
      </Button>
    );
  }

  function topic_view(topic) {
    return (
      <Button variant="light" style={{width: "100%"}} onClick={followTopic}>
        Follow   <Badge variant="info">{topic}</Badge>
      </Button>
    )
  }

  var posts = props.posts.map(x => <li key={x.post_id}>{post_view(x)}</li>);
return <>
    <Snackbar open={showSuccessFollow} autoHideDuration={6000} onClose={() => setShowSuccessFollow(!showSuccessFollow)}>
      <Alert onClose={() => setShowSuccessFollow(!showSuccessFollow)} variant="success" dismissible>
        Now following {props.topic}
      </Alert>
    </Snackbar>
    <Snackbar open={showError} autoHideDuration={6000} onClose={() => setShowError(!showError)}>
      <Alert onClose={() => setShowError(!showError)} variant="danger" dismissible>
        An error occured
      </Alert>
      </Snackbar>
      <Backdrop className={styling.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <List className={styling.root}>
        {
          props.page_type === "search_posts" ?
          <li><Typography variant="h5">{topic_view(props.topic)}</Typography></li>
          : 
          null
        }
      {posts}
      </List>
  </>
}
