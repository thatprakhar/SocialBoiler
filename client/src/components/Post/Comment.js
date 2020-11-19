// Credits : https://github.com/gunasai/material-ui-comments
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
  },
  fonts: {
    fontWeight: "bold"
  },
  inline: {
    display: "inline",
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
  }
}));

const Comment = ({ comments }) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {comments.sort((a, b) => {
        if (a.id < b.id) return 1;
        return -1
      }).map(comment => {
        console.log("Comment", comment);
        return (
          <React.Fragment key={comment.id}>
            <ListItem key={comment.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={comment.username[0]} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className={classes.fonts}>
                    {comment.username}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                    >
                      {comment.comment}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default Comment;
