import React from "react";
import {
  makeStyles,
  Avatar,
  Typography,
  IconButton,
  Link,
  Hidden,
  Button
} from "@material-ui/core";
import { Container, Row, Col, ButtonGroup, Badge } from "react-bootstrap";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CommentIcon from "@material-ui/icons/Comment";
import CloseIcon from "@material-ui/icons/Close";
import BookmarkIcon from "@material-ui/icons/Bookmark";

const createStyles = makeStyles(theme => ({
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
    background: "purple"
  },
  closeButton: {
    position: "fixed",
    right: -5
  }
}));

export default function Post(props) {
  const styling = createStyles();
  if (props.post_data === null) {
    return <div></div>;
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
              <Badge variant="dark">{props.post_data.topic}</Badge>
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Avatar className={styling.small && styling.purple}>
                {props.post_data.userName[0]}
              </Avatar>
              <Link
                href={"profile?username=" + props.post_data.userName}
                color="inherit"
              >
                <Typography variant="body1" className={styling.userline}>
                  {props.post_data.userName}
                </Typography>
              </Link>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
          <Typography variant="body1">{props.post_data.text}</Typography>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
          <ButtonGroup>
            <IconButton>
              <ThumbUpAltIcon></ThumbUpAltIcon>
            </IconButton>
            <IconButton>
              <ThumbDownIcon></ThumbDownIcon>
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
    </Container>
  );
}
