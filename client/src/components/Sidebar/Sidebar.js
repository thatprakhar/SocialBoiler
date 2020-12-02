import React, { useEffect, useState } from "react";
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
import CircularProgress from "@material-ui/core/CircularProgress";

const createStyles = makeStyles(theme => ({
  overlay: {
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? '#dbd8e3' : '#4b5d67' : '#dbd8e3',
    width: '100%',
    height: '100%',
    // width: window.innerWidth <= 720 ? window.innerWidth : '350px',
    wordWrap: 'break-word'
  },
  inline: {
    display: "inline",
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
  },
  post: {
    marginTop: 50,
    width: "100%",
    overflowWrap: 'normal',
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
  },
  root: {
    position: "relative",
    overflow: "auto",
    width: "100%",
    height: '100%'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
  notif: {
    zIndex: theme.zIndex.drawer + 1,
    position: "absolute"
  },
  description: {
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black',
    wordWrap: 'break-word',
    width: "100%"
  }
}));

export default function App(props) {
  var styling = createStyles();
  const [loading, setLoading] = useState(false);
  const [showSuccessFollow, setShowSuccessFollow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fetchedFollowState, setFetchedFollowState] = useState(false);
  const [topicFollowed, setTopicFollowed] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
          setTopicFollowed(true);
          setShowSuccessFollow(true);
          setSuccessMessage("Now following");
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  function unfollowTopic() {
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
    fetch(API_URL + "/unfollow_topic", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data === "failed") {
          setShowError(true);
        } else {
          setTopicFollowed(false);
          setShowSuccessFollow(true);
          setSuccessMessage("Unfollowed");
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (props.topic === "") return
    setFetchedFollowState(false);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        username: localStorage.getItem("username"),
        topic: props.topic
      }
    };
    fetch(API_URL + "/topic_is_followed", requestOptions)
      .then(res => res.json())
      .then(data => {
        setTopicFollowed(data);
        setFetchedFollowState(true);
      })
      .catch(err => {
        console.log(err)
        setFetchedFollowState(true);
      });
  }, [props.topic]);

  function post_view(post_data) {
    return (
      <Button
        style={{ width: "100%" }}
        variant={localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'light' : 'dark': 'light'}
        onClick={() => parentHandle(post_data)}
      >
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar>{post_data.anonymous === "false" || post_data.username === localStorage.getItem("username") ? post_data.username[0] : "A"}</Avatar>
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
                  {post_data.anonymous === "false" ? post_data.username : post_data.username === localStorage.getItem("username") ? post_data.username + "(Anonymous to others)": "Anonymous"} {" - "}
                </Typography>
                <span className={styling.description}>{post_data.description.substr(0, 75)}</span>
                {"..."}
                <Badge variant={localStorage.getItem("theme") ? localStorage.getItem("theme") === 'Light' ? "dark" : "light" : "dark"}>{post_data.topics}</Badge>
              </React.Fragment>
            }
          />
        </ListItem>
      </Button>
    );
  }

  function topic_view(topic) {
    if (loading) {
      return  <div style={{ textAlign: 'center' }}>
      <CircularProgress color="inherit" fontSize={24} />
      </div>
    }
    if (topicFollowed === false) {
      return (
        <Button
          variant="success"
          style={{ width: "100%" }}
          onClick={followTopic}
          disabled={!fetchedFollowState}
        >
          Follow <Badge variant="info">{topic}</Badge>
        </Button>
      );
    } else {
      return (
        <Button
          variant="danger"
          style={{ width: "100%" }}
          onClick={unfollowTopic}
          disabled={!fetchedFollowState}
        >
          Unfollow <Badge variant="info">{topic}</Badge>
        </Button>
      );
    }
  }

  var posts = null;
  if (props.posts.length > 0) {
    posts = props.posts.map(x => <li key={x.post_id}>{post_view(x)}</li>);
  } else if (props.posts.length === 0) {
    posts = <Badge variant="info"><Typography vairant="caption">Search for topics and people to view posts</Typography></Badge>
  }
  return (
    <div className={styling.overlay}>
      <Snackbar
        open={showSuccessFollow}
        autoHideDuration={6000}
        onClose={() => setShowSuccessFollow(!showSuccessFollow)}
      >
        <Alert
          onClose={() => setShowSuccessFollow(!showSuccessFollow)}
          variant="success"
          dismissible
        >
          {successMessage + " " + props.topic}
        </Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(!showError)}
      >
        <Alert
          onClose={() => setShowError(!showError)}
          variant="danger"
          dismissible
        >
          An error occured
        </Alert>
      </Snackbar>
      <List className={styling.root}>
        {props.page_type === "search_posts" ? (
          <li>
            <Typography variant="h5">{topic_view(props.topic)}</Typography>
          </li>
        ) : null}
        {posts}
        {props.posts.length > 0 && 
        <h2>
        <Badge variant="success">
            That's all the posts you've got! ({props.posts.length} posts)
        </Badge>
        </h2>}
      </List>
    </div>
  );
}
