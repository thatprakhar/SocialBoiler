import React, { useState } from "react";
import { makeStyles, IconButton } from "@material-ui/core";
import { Container, Row } from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";
import { TextField, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const createStyles = makeStyles(theme => ({
  root: {
    marignLeft: 10,
    background: "white",
    borderRadius: 10,
    width: "100vw",
    maxHeight: window.innerHeight
  },
  closeIcon: {
    fontSize: 40
  },
  closeButton: {
    position: "fixed",
    zIndex: 999,
    right: "0px"
  },
  form: {
    margin: "auto",
    marginTop: "5%"
  },
  sendButton: {
    background: "#71C541"
  },
  backdrop: {
    zIndex: 999,
    color: "#fff"
  },
  imageInput: {
    display: "none"
  }
}));

export default function Post(props) {
  const styling = createStyles();
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postTopic, setPostTopic] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "http://127.0.0.1:5000";
  function log(x) {
    console.log(x);
  }

  /*function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"));
      }, ms);
      promise.then(resolve, reject);
    });
  }*/

  function sendPost(e) {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        title: postTitle,
        description: postText,
        image: postImage,
        topics: postTopic
      }
    };
    setLoading(true);

    fetch(API_URL + "/insert_post", requestOptions)
      .then(res => res.json())
      .then(res => {
        if (res === "success") {
          setLoading(false);
          setSuccessMessage("Posted Successfully!");
          setErrorMessage("");
          setPostImage(null);
          setPostText("");
          setPostTitle("");
          setPostTopic("");
        } else {
          setLoading(false);
          setErrorMessage("The action could not be performed.");
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMessage("Could not connecct to the server.");
      });
  }

  return (
    <Container className={styling.root}>
      <Backdrop className={styling.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <IconButton onClick={props.toggleView} className={styling.closeButton}>
        <CloseIcon className={styling.closeIcon} color="secondary" />
      </IconButton>
      <form className={styling.form} onSubmit={sendPost}>
        <Container>
          <Row></Row>
          <br />
          <Row>
            {" "}
            <TextField
              required
              id="outlined-required"
              label="Post Title"
              variant="outlined"
              style={{ width: "100%" }}
              onInput={e => {
                e.target.value = e.target.value.slice(0, 150);
              }}
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
            />
          </Row>
          <br />
          <Row>
            <TextField
              required
              id="outlined-required"
              label="Post Body"
              variant="outlined"
              style={{ width: "100%" }}
              multiline
              value={postText}
              onInput={e => {
                e.target.value = e.target.value.slice(0, 500);
              }}
              onChange={e => setPostText(e.target.value)}
            />
          </Row>
          <br />
          <Row>
            <TextField
              required
              id="outlined-required"
              label="Post Topic"
              variant="outlined"
              onInput={e => {
                if (e.target.value.indexOf(" ") !== -1) {
                  e.target.value = e.target.value.slice(
                    0,
                    e.target.value.indexOf(" ")
                  );
                }
              }}
              value={postTopic}
              onChange={e => setPostTopic(e.target.value)}
            />
          </Row>
          <br />
          <Row>
            <input
              accept="image/*"
              className={styling.imageInput}
              id="contained-button-file"
              multiple
              type="file"
              onChange={e => setPostImage(e.target.value)}
            />
            <label htmlFor="contained-button-file">
              <Button color="primary" variant="outlined" component="span">
                Upload Image
              </Button>
              <br />
              {postImage}
            </label>
          </Row>
          <br />
          <Row>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
            >
              Post
            </Button>
          </Row>
          <br />
          <br />
          <Row>
            {errorMessage !== "" ? (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errorMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : null}
            {successMessage !== "" ? (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {successMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            ) : null}
          </Row>
        </Container>
      </form>
    </Container>
  );
}
