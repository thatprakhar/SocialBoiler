import React, { useState } from "react";
import Login from "../Login/Login";
import ProfileHeader from "../Profile/ProfileHeader";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import { Container, makeStyles, Grid } from "@material-ui/core";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const createStyles = makeStyles(() => ({
  feed: {
    marginTop: 20
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
  // var post_view = posts.map(x => <Post key={x.postID} post_data={x}></Post>);
  const [selectedPost, setSelectedPost] = useState(posts[0]);

  function parentHandler(selection) {
    setSelectedPost(selection);
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
        <Sidebar
          className={styling.sidebar}
          posts={posts}
          parentHandler={parentHandler}
        />
        <Grid className={styling.feed} sm={0}>
          <Post post_data={selectedPost}></Post>
        </Grid>
      </div>
    </div>
  );
}
