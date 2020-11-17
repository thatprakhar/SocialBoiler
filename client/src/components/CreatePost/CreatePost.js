import React, { useState } from "react";
import {
  makeStyles,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
  withStyles
} from "@material-ui/core";
import { Container, Row, Alert, Button as ButtonRB } from "react-bootstrap";
import CloseIcon from "@material-ui/icons/Close";
import { TextField, Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black',
      },
      '&:hover fieldset': {
        borderColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'blue' : 'white' : 'blue',
      },
      '&.Mui-focused fieldset': {
        borderColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'blue' : 'white' : 'blue',
      }
    }
  },
})(TextField);


const createStyles = makeStyles(theme => ({
  root: {
    marignLeft: 10,
    background: "white",
    borderRadius: 10,
    width: "100vw",
    maxHeight: window.innerHeight,
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
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
  },
  input: {
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black',
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
  const [anonymous, setAnonymous] = useState(false);
  const API_URL = "http://127.0.0.1:5000";

  function sendPost(e) {
    e.preventDefault();
    const reader = new FileReader();
    if (postImage !== null) {
      reader.addEventListener("load", event => {
        const requestOptions = {
          method: "POST",

          headers: {
            "Content-type": "application/json; charset=UTF-8",
            username: localStorage.getItem("username"),
            auth_token: localStorage.getItem("auth_token"),
            title: postTitle,
            description: postText,
            image: event.target.result,
            topics: postTopic,
            anonymous: anonymous
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
            setErrorMessage("Could not connect to the server.");
          });
      });
      reader.readAsDataURL(postImage[0]);
    } else {
      const requestOptions = {
        method: "POST",

        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          title: postTitle,
          description: postText,
          image: postImage,
          topics: postTopic,
          anonymous: anonymous
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
          setErrorMessage("Could not connect to the server.");
        });
    }
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
            <CssTextField
              required
              InputProps={{
                className: styling.input
              }}
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
             <Typography variant="caption">{postTitle.length} / 150</Typography>
          </Row>
          <br />
          <Row>
            <CssTextField
              id="outlined"
              InputProps={{
                className: styling.input
              }}
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
            <Typography variant="caption">{postText.length} / 500</Typography>
          </Row>
          <br />
          <Row>
            <CssTextField
              required
              InputProps={{
                className: styling.input
              }}
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
              onChange={e => {
                setPostImage(e.target.files);
              }}
            />
            <label htmlFor="contained-button-file">
              <Button color="primary" variant="outlined" component="span">
                Upload Image
              </Button>
              <br />
            </label>
          </Row>
          <br />

          {postImage !== null && (
            <>
              <Row>{postImage[0].name}</Row>
              <br />
              <Row>
                <ButtonRB
                  variant="outline-danger"
                  onClick={() => setPostImage(null)}
                >
                  Remove Image
                </ButtonRB>
              </Row>
              <br />
            </>
          )}

          <Row>
            <FormControlLabel
              value="end"
              control={<Switch color="primary" />}
              label="Anonymous"
              labelPlacement="end"
              onChange={() => {
                setAnonymous(!anonymous);
              }}
            />
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
              <Alert
                variant="danger"
                onClose={() => setErrorMessage("")}
                dismissible
              >
                {errorMessage}
              </Alert>
            ) : null}
            {successMessage !== "" ? (
              <Alert
                variant="success"
                onClose={() => setSuccessMessage("")}
                dismissible
              >
                {successMessage}
              </Alert>
            ) : null}
          </Row>
        </Container>
      </form>
    </Container>
  );
}
