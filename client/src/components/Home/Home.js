import React, { useState } from "react";
import Login from "../Login/Login";
import ProfileHeader from "../Profile/ProfileHeader";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import { makeStyles, Grid, Hidden, IconButton } from "@material-ui/core";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreatePost from "../CreatePost/CreatePost";

const createStyles = makeStyles(() => ({
  feed: {
    marginTop: 40,
    maxHeight: window.innerHeight
  },
  main: {
    display: "flex",
    flexDirection: "row"
  },
  sidebar: {
    height: "100vw",
    border: "1px solid red",
    width: 400,
    marginLeft: 100,
    background: "red"
  },
  addButton: {
    position: "fixed",
    zIndex: 999,
    bottom: "0px",
    right: "0px"
  },
  addButtonIcon: {
    fontSize: 50
  }
}));

export default function Home() {
  const styling = createStyles();

  const posts = [
    {
      postID: 1,
      userName: "Prakhar",
      title: "A new post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit.",
      topic: "#general"
    },
    {
      postID: 2,
      userName: "Cindy",
      title: "A second post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut.",
      topic: "#topic1"
    },
    {
      postId: 3,
      userName: "Onur",
      title: "Another post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut.",
      topic: "#topic2"
    },
    {
      postID: 4,
      userName: "Sayed",
      title: "Last post",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      topic: "#general"
    },
    {
      postID: 5,
      userName: "Uras",
      title: "A new post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit.",
      topic: "#general"
    },
    {
      postID: 6,
      userName: "Cindy",
      title: "A second post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut.",
      topic: "#topic1"
    },
    {
      postId: 7,
      userName: "Onur",
      title: "Another post",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut.",
      topic: "#topic2"
    },
    {
      postID: 8,
      userName: "Sayed",
      title: "Last post",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      topic: "#general"
    }
  ];

  for (let i = 0; i < 50; i++) {
    posts.push(posts[i % posts.length]);
  }

  // var post_view = posts.map(x => <Post key={x.postID} post_data={x}></Post>);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateScreen, setShowCreateScreen] = useState(false);

  function parentHandler(selection) {
    setSelectedPost(selection);
  }
  function removePost() {
    console.log("changed\n");
    setSelectedPost(null);
  }

  return (
    <div>
      <Router>
        <Route path="/login" component={Login}></Route>
        <Route exact path="/home">
          {localStorage.getItem("auth_token") ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
      </Router>
      <ProfileHeader />
      <div className={styling.main}>
        {(selectedPost !== null || showCreateScreen === true) &&
        window.innerWidth <= 600 ? null : (
          <Sidebar
            className={styling.sidebar}
            posts={posts}
            parentHandler={parentHandler}
          />
        )}

        {}

        {showCreateScreen ? null : (
          <IconButton
            className={styling.addButton}
            onClick={e => setShowCreateScreen(!showCreateScreen)}
          >
            <AddCircleIcon className={styling.addButtonIcon} color="primary" />
          </IconButton>
        )}

        <Hidden mdDown>
          {showCreateScreen ? (
            <CreatePost
              toggleView={() => setShowCreateScreen(!showCreateScreen)}
            />
          ) : (
            <Grid className={styling.feed}>
              <Post post_data={selectedPost}></Post>
            </Grid>
          )}
        </Hidden>

        <Hidden mdUp>
          {showCreateScreen && (
            <CreatePost
              toggleView={() => setShowCreateScreen(!showCreateScreen)}
            />
          )}
        </Hidden>

        {selectedPost !== null && (
          <Hidden mdUp>
            <Post post_data={selectedPost} removePost={removePost}></Post>
          </Hidden>
        )}
      </div>
    </div>
  );
}
