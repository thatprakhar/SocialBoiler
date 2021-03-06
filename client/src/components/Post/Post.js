import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Avatar,
  Typography,
  IconButton,
  Link,
  Hidden,
  Button,
  CircularProgress,
  Snackbar
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
import SendIcon from "@material-ui/icons/Send";
import CommentIcon from "@material-ui/icons/Comment";
import CloseIcon from "@material-ui/icons/Close";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import Comment from "./Comment";
import InboxOutlinedIcon from '@material-ui/icons/InboxOutlined';
import { CssTextField } from "../CreatePost/CreatePost";
import { timeSince } from "./Comment";

const createStyles = makeStyles(theme => ({
  root: {
    marginTop: 20,
    marignLeft: 20,
    borderRadius: 10,
    width: "100%",
    maxHeight: '100%',
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
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
  },
  input: {
    backgroundColor: 'white'
  },
  buttonLoading: {
    fontSize: '12'
  },
  comments: {
    height: '300px',
    width: '100%',
    overflowY: 'scroll'
}
}));

export default function Post(props) {
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const styling = createStyles();
  const API_URL = "http://127.0.0.1:5000";
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingButtons, setLoadingButtons] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(true);
  const [comments, setComments] = useState([])
  const [isFetchingSavedStatus, setIsFetchingSavedStatus] = useState(false);

  useEffect(() => {
    if (props.post_data !== null) {
      setUpVoted(props.post_data.upVoted);
      setDownVoted(props.post_data.downVoted);
      setLikes(props.post_data.likes);
      setDislikes(props.post_data.dislikes);
      setComments([]);
      if (props.post_data.bookmarked && Array.isArray(props.post_data.bookmarked)) {
        setSaved(props.post_data.bookmarked.some(user => user === localStorage.getItem("username")));
      } else {
        setSaved(false)
      }
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          profile_user: localStorage.getItem("username")
        }
      };
      setLoadingButtons(true);
      var done = 0;
      fetch(API_URL + '/get_liked_posts_by_user', requestOptions)
      .then(res => res.json())
      .then(data => {
        done++;
        if (done >= 2) {
          setLoadingButtons(false);
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
          setLoadingButtons(false);
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].post_id === props.post_data.post_id) {
            setUpVoted(false);
            setDownVoted(true);
          }
        }
      })
      .catch(err => console.log(err))

      setIsFetchingSavedStatus(true);
      const requestOptionsSaved = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          post_id: props.post_data.post_id
        }
      };
      fetch(API_URL + "/get_post_by_id", requestOptionsSaved)
      .then(res => res.json())
      .then(data => {
        setIsFetchingSavedStatus(false)
        if (data[0].bookmarked && Array.isArray(data[0].bookmarked)) {
          setSaved(data[0].bookmarked.some(user => user === localStorage.getItem("username")))
        } else {
          setSaved(false)
        }
        setLikes(data[0].likes)
        setDislikes(data[0].dislikes)
      })
      .catch(err => console.log(err))


      const requestOptionsComments = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          post_id: props.post_data.post_id
        }
      };
      setIsFetchingComments(true)
      fetch(API_URL + "/get_commented_post_by_id", requestOptionsComments)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setComments(data)
          console.log(data)
          setIsFetchingSavedStatus(false)
          setIsFetchingComments(false)
        })
        .catch(err => {
          console.log(err);
          setIsFetchingSavedStatus(false)
          setIsFetchingComments(false)
        })
    }
  }, [props.post_data]);

  useEffect(() => {
    if (props.post_data) {
      const requestOptionsComments = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          post_id: props.post_data.post_id
        }
      };
      fetch(API_URL + "/get_commented_post_by_id", requestOptionsComments)
        .then(res => res.json())
        .then(data => {
          setComments(data)
        })
        .catch(err => {
          console.error(err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendingComment])

  if (props.post_data === null) {
    return <Container className={styling.root}>
    <div style={{ margin: 'auto', width: "50%", marginTop: '20%' }}>
    <Row>
      <InboxOutlinedIcon style={{ margin: "auto" }} fontSize="large" />
    </Row>
      <Row>
        <Typography style={{ margin: "auto" }} variant="caption">Select a post to view</Typography>
      </Row>
    </div>
    </Container>;
  }

  function postComment() {
    setComment(comment.trim());
    if (comment === '') return;
    setSendingComment(true);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        post_id: props.post_data.post_id,
        comment: comment,
        bookmarked: saved,
        profile_user: localStorage.getItem('username')
      }
    };

    fetch(API_URL + "/comment", requestOptions)
    .then(res => res.json())
    .then(data => {
      if (data === 'failed') {
        setErrorMessage('Could not perform the action.');
      } else {
        setComment('');
        setShowCommentBox(false);
        setComments([...comments])
      }
      setSendingComment(false);
      console.log(data)
    })
    .catch(err => {
      console.log(err);
      setSendingComment(false);
      setErrorMessage('Could not connect to the server');
    })
  }

  function handleSavePost() {
    setLoadingButtons(true)
    // const savedState = !saved;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        post_id: props.post_data.post_id,
        profile_user: localStorage.getItem("username")
      }
    };
    fetch(API_URL + "/bookmark_post_user", requestOptions)
    .then(res => res.json())
    .then(data => {
      if (data === 'failed') {
        setErrorMessage('Failed to perform action.');
      } else {
        setSaved(!saved);
      }
      setLoadingButtons(false)
    })
    .catch(err => {
      setLoadingButtons(false);
      setErrorMessage('Could not connect to server');
    })

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
    setLoadingButtons(true)
    fetch(API_URL + "/vote", requestOptions)
      .then(res => res.json())
      .then(res => {
        setLoadingButtons(false)
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
        setLoadingButtons(false)
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
    setLoadingButtons(true)
    fetch(API_URL + "/vote", requestOptions)
      .then(res => res.json())
      .then(data => {
        setLoadingButtons(false)
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
        setLoadingButtons(false)
        console.log(err);
        setErrorMessage(err);
      });
  }

  function removePost() {
    // console.log("removing");
    props.removePost();
  }

  return (
    <Container className={styling.root}>
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
                <Badge variant={localStorage.getItem("theme") ? localStorage.getItem("theme") === 'Light' ? "dark" : "light" : "dark"} type="link">
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
                Posted {timeSince(new Date(props.post_data.date_created))} ago
              </Typography>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col style={{wordWrap: 'break-word'}} sm={12}>
          <Typography variant="body1" >{props.post_data.description}</Typography>
          {props.post_data.image !== "null" && (
            <Image src={props.post_data.image} alt="An image" fluid />
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
        {loadingButtons || isFetchingSavedStatus ? <CircularProgress color="primary" size={20}/>: 
        <ButtonGroup>
            <IconButton onClick={upVotePost} disabled={loadingButtons}>
              <ThumbUpAltIcon
                color={upVoted ? "primary" : "inherit"}
              ></ThumbUpAltIcon>
            </IconButton>
            <IconButton onClick={downVotePost} disabled={loadingButtons}>
              <ThumbDownIcon
                color={downVoted ? "secondary" : "inherit"}
              ></ThumbDownIcon>
            </IconButton>
            <IconButton onClick={() => setShowCommentBox(!showCommentBox)} disabled={loadingButtons}>
              <CommentIcon color={loadingButtons ? "inherit" : 'primary'}></CommentIcon>
            </IconButton>
            <IconButton onClick={() => handleSavePost()} disabled={loadingButtons}>
              <BookmarkIcon color={saved ? "primary" : 'inherit'}/>
            </IconButton>
          </ButtonGroup>
        }
        </Col>
      </Row>
      <br />
      <Row>
          <Col xs={3} lg={3}>
            <Badge variant="primary">Likes: {likes}</Badge>
          </Col>
          <Col xs={3} lg={3}>
            <Badge variant="danger">Dislikes: {dislikes}</Badge>
          </Col>
      </Row>
      <br />
      {showCommentBox && 
      <>
      <Row>
        <Col xs={12}>
        <CssTextField
              id="outlined"
              InputProps={{
                className: styling.input
              }}
              label="Comment"
              variant="outlined"
              style={{ width: "100%" }}
              multiline
              value={comment}
              onInput={e => {
                e.target.value = e.target.value.slice(0, 200);
              }}
              onChange={e => setComment(e.target.value)}
            />
            <Typography variant="caption">{comment.length} / 200</Typography>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={12} lg={3}>
          {sendingComment ? 
            <CircularProgress color="primary" size={25}/>
            : 
            <Button
            color="primary"
            variant="contained"
            onClick={() => postComment()}
            startIcon={<SendIcon />}
            >
              Comment
          </Button>
            }
        </Col>
      </Row>
      <br />
      </>
      }
      <Row>
          <Col>
            <Typography variant="h5">
                Comments ({comments.length})
            </Typography>
          </Col>
      </Row>
      <br />
      <Row>
        {isFetchingComments ? <><CircularProgress /> </>
        : 
          <div className={styling.comments}>
            <Comment comments={comments} />
          </div>
        }
          
          {//key={props.post_data.post_id} postId={props.post_data.post_id}}
          }
      </Row>
      <br />
      <Snackbar
        open={errorMessage !== ''}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          variant="danger"
          dismissible
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
