import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Avatar,
  Typography,
  IconButton,
  Link,
  Hidden,
  Button,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Badge,
  Alert,
  Image
} from "react-bootstrap";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CommentIcon from "@material-ui/icons/Comment";
import CloseIcon from "@material-ui/icons/Close";
import BookmarkIcon from "@material-ui/icons/Bookmark";

const createStyles = makeStyles(theme => ({
  root: {
    marignLeft: 20,
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
    background: "purple"
  },
  closeButton: {
    position: "fixed",
    right: -5
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

export default function Post(props) {
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);
  const styling = createStyles();
  const API_URL = "http://127.0.0.1:5000";
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    if (props.post_data !== null) {
      setUpVoted(props.post_data.upVoted);
      setDownVoted(props.post_data.downVoted);
      setLikes(props.post_data.likes);
      setDislikes(props.post_data.dislikes);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          profile_user: localStorage.getItem("username")
        }
      };
      setLoading(true);
      var done = 0;
      fetch(API_URL + '/get_liked_posts_by_user', requestOptions)
      .then(res => res.json())
      .then(data => {
        done++;
        if (done >= 2) {
          setLoading(false);
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].post_id === props.post_data.post_id) {
            setUpVoted(true);
            setDownVoted(false);
          }
        }
      })
      .catch(err => console.log(err))

      fetch(API_URL + '/get_disliked_posts_by_user', requestOptions)
      .then(res => res.json())
      .then(data => {
        done++;
        if (done >= 2) {
          setLoading(false);
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].post_id === props.post_data.post_id) {
            setUpVoted(false);
            setDownVoted(true);
          }
        }
      })
      .catch(err => console.log(err))
    }
  }, [props.post_data]);
  if (props.post_data === null) {
    return <div></div>;
  }

  function upVotePost() {
    let original_upvote = upVoted;
    let original_downvote = downVoted;
    let decreaseDislikeCount = downVoted;
    if (original_upvote === true) {
      original_downvote = false;
      original_upvote = false;
    } else {
      original_upvote = true;
      original_downvote = false;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        post_id: props.post_data.post_id,
        username: localStorage.getItem("username"),
        liked: original_upvote,
        disliked: original_downvote
      }
    };
    console.log(original_upvote + " " + original_downvote);
    setLoading(true)
    fetch(API_URL + "/vote", requestOptions)
      .then(res => res.json())
      .then(res => {
        setLoading(false)
        if (res === "failed") {
          setErrorMessage("Could not perform the action. Try again later");
        } else {
          if (decreaseDislikeCount) {
            setDislikes(dislikes - 1);
          }
          setLikes(likes + 1);
          setUpVoted(original_upvote);
          setDownVoted(original_downvote);
        }
      })
      .catch(err => {
        setLoading(false)
        setErrorMessage("Could not connect to the server. Try again later");
      });
  }

  function downVotePost() {
    let original_upvote = upVoted;
    let original_downvote = downVoted;
    let decreaseLikecount = upVoted;
    if (original_downvote === true) {
      original_downvote = false;
      original_upvote = false;
    } else {
      original_upvote = false;
      original_downvote = true;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth_token: localStorage.getItem("auth_token"),
        post_id: props.post_data.post_id,
        username: localStorage.getItem("username"),
        liked: original_upvote,
        disliked: original_downvote
      }
    };
    setLoading(true)
    fetch(API_URL + "/vote", requestOptions)
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        if (data === "failed") {
          setErrorMessage(
            "Could not perform the action. Server is down. Try again later"
          );
        } else {
          if (decreaseLikecount) {
            setLikes(likes - 1);
          }
          setDislikes(dislikes + 1);
          setUpVoted(original_upvote);
          setDownVoted(original_downvote);
        }
      })
      .catch(err => {
        setLoading(false)
        console.log(err);
        setErrorMessage(err);
      });
  }

  function removePost() {
    // console.log("removing");
    props.removePost();
  }
  console.log(props.post_data);
  return (
    <Container className={styling.root}>
      <Backdrop className={styling.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Hidden mdUp>
        <Button
          color="secondary"
          onClick={removePost}
          className={styling.closeButton}
        >
          <CloseIcon />
        </Button>
        <br />
      </Hidden>

      <Row>
        <Col lg={true}>
          <Typography variant="h4">{props.post_data.title}</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6">
              <a href={"/get_posts_by_topic?topic=" + props.post_data.topics}>
                <Badge variant="dark" type="link">
                  {props.post_data.topics}
                </Badge>
              </a>
            </Typography>
            <div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Avatar className={styling.small && styling.purple}>
                  {props.post_data.anonymous === "false" || props.post_data.username === localStorage.getItem("username") ? props.post_data.username[0] : "A"}
                </Avatar>
                <Link
                  href={"profile?username=" + (props.post_data.anonymous === "false" || props.post_data.username === localStorage.getItem("username") ? props.post_data.username : "Anonymous")}
                  color="inherit"
                >
                  <Typography variant="body1" className={styling.userline}>
                    {props.post_data.anonymous === "false" ? props.post_data.username : props.post_data.username === localStorage.getItem("username") ? props.post_data.username + "(Anonymous to others)" : "Anonymous"}
                  </Typography>
                </Link>
              </div>
              <Typography variant="caption">
                Posted on {props.post_data.date_created.slice(0, -7)}
              </Typography>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col style={{wordWrap: 'break-word'}} sm={12}>
          <Typography variant="body1" >{props.post_data.description}</Typography>
          {props.post_data.image !== "null" && (
            <Image src={props.post_data.image} fluid />
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
          <ButtonGroup>
            <IconButton onClick={upVotePost}>
              <ThumbUpAltIcon
                color={upVoted ? "primary" : "inherit"}
              ></ThumbUpAltIcon>
            </IconButton>
            <IconButton onClick={downVotePost}>
              <ThumbDownIcon
                color={downVoted ? "secondary" : "inherit"}
              ></ThumbDownIcon>
            </IconButton>
            <IconButton>
              <CommentIcon></CommentIcon>
            </IconButton>
            <IconButton>
              <BookmarkIcon />
            </IconButton>
          </ButtonGroup>
        </Col>
      </Row>
      <br />
      <Row>
          <Col xs={1}>
            <Badge variant="primary">Likes: {likes}</Badge>
          </Col>
          <Col xs={1}>
            <Badge variant="danger">Dislikes: {dislikes}</Badge>
          </Col>
      </Row>
      <br />
      <Row>
          <Col>
            <Typography variant="h5">Comments </Typography>
          </Col>
      </Row>
      <br />
      {errorMessage !== "" && (
        <Row>
          <Alert
            variant="danger"
            onClose={() => setErrorMessage("")}
            dismissible
          >
            {errorMessage}
          </Alert>
        </Row>
      )}
    </Container>
  );
}
