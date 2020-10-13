import React from "react";
import {
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from "@material-ui/core";
import { Button, Badge } from "react-bootstrap";

const createStyles = makeStyles(theme => ({
  inline: {
    display: "inline"
  },
  post: {
    border: "1px solid black",
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
  }
}));

export default function App(props) {
  var styling = createStyles();

  function parentHandle(post_data) {
    props.parentHandler(post_data);
  }

  function post_view(post_data) {
    return (
      <Button variant="light" onClick={() => parentHandle(post_data)}>
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
                  {post_data.userName} -{" "}
                </Typography>
                {post_data.text.substr(0, 120)}
                {"..."}
                <Badge variant="dark">{post_data.topic}</Badge>
              </React.Fragment>
            }
          />
        </ListItem>
      </Button>
    );
  }

  var posts = props.posts.map(x => <li>{post_view(x)}</li>);
  return <List className={styling.root}>{posts}</List>;
}
