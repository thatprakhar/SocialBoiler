import React from "react";
import { makeStyles, Avatar, Typography, IconButton } from "@material-ui/core";
import { Container, Row, Col, ButtonGroup, Badge } from "react-bootstrap";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import CommentIcon from "@material-ui/icons/Comment";
import BookmarkIcon from "@material-ui/icons/Bookmark";
const createStyles = makeStyles(theme => ({
  root: {
    "box-shadow": "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    marginTop: 100,
    background: "white",
    borderRadius: 10
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
  }
}));

export default function Post(props) {
  const styling = createStyles();

  return (
    <Container className={styling.root}>
      <Row>
        <Col lg={true}>
          <Typography variant="h3">{props.title}</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h5">
              <Badge variant="dark">{props.topic}</Badge>
            </Typography>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Avatar className={styling.small && styling.purple}>
                {props.userName[0]}
              </Avatar>
              <Typography variant="h6" className={styling.userline}>
                {props.userName}
              </Typography>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ marginTop: 20 }}>
        <Col lg={true}>
          <Typography variant="h6">{props.text}</Typography>
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
