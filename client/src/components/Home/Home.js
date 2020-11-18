import React, { useEffect, useState } from "react";
import Login from "../Login/Login";
import Post from "../Post/Post";
import Sidebar from "../Sidebar/Sidebar";
import { makeStyles, Grid, Hidden, IconButton } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CreatePost from "../CreatePost/CreatePost";
import CircularProgress from "@material-ui/core/CircularProgress";

const createStyles = makeStyles(theme => ({
  feed: {
    marginTop: 0,
    maxHeight: "100vw",
    maxWidth: window.innerWidth,
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
  },
  main: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'white' : '#363738' : 'white',
    color: localStorage.getItem('theme') ? localStorage.getItem('theme') === 'Light' ? 'black' : 'white' : 'black'
  },
  sidebar: {
    height: "100vw",
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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

export default function Home(props) {
  const styling = createStyles();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:5000";
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

  function comparePosts(a, b) {
    if (a.post_id < b.post_id) {
      return 1;
    } else if (a.post_id > b.post_id) {
      return -1;
    } else {
      return 0;
    }

  }

  useEffect(() => {
    if (props.page_type === "my_posts") {
      setPosts([]);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          profile_user: localStorage.getItem("username")
        }
      };
      fetch(API_URL + "/get_own_posts", requestOptions)
        .then(res => res.json())
        .then(data => {
          data.sort(comparePosts);
          console.log(data);
          setPosts(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else if (props.page_type === "search_posts") {
      setPosts([]);
      const query = new URLSearchParams(location.search);
      console.log(query.get("topic"));
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token"),
          topic: query.get("topic")
        }
      };
      fetch(API_URL + "/get_posts_by_topic", requestOptions)
        .then(res => res.json())
        .then(data => {
          data.sort(comparePosts);
          console.log(data);
          setPosts(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    } else if (props.page_type === "home") {
      setPosts([]);
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          username: localStorage.getItem("username"),
          auth_token: localStorage.getItem("auth_token")
        }
      };
      fetch(API_URL + "/get_following_user_posts", requestOptions)
        .then(res => res.json())
        .then(data => {
          data.sort(comparePosts);
          console.log(data);
          setPosts(data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [location.search, props.page_type]);

  if (loading) {
    return (
      <div className={styling.main}>
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
        <CircularProgress style={{ margin: 'auto', marginTop: '20%' }} color="primary" />
      </div>
    )
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
      <div className={styling.main}>
        {(selectedPost !== null || showCreateScreen === true) &&
        window.innerWidth <= 600 ? null : (
          <Sidebar
            className={styling.sidebar}
            posts={posts}
            parentHandler={parentHandler}
            page_type={props.page_type}
            topic={
              props.page_type === "search_posts"
                ? new URLSearchParams(location.search).get("topic")
                : ""
            }
          />
        )}
        {!showCreateScreen && (
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
          {showCreateScreen && props.page_type === "home" && (
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
