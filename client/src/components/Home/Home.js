import React from "react";
import Login from "../Login/Login";
import ProfileHeader from "../Profile/ProfileHeader";
import Post from "../Post/Post";
import { Container, makeStyles } from "@material-ui/core";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

const createStyles = makeStyles(() => ({
  feed: {
    marginTop: 20
  }
}));

export default function Home() {
  const styling = createStyles();

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
      <Container className={styling.feed}>
        <Post
          userName="thatprakhar"
          title="A new post"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit."
          topic="#general"
        />
        <Post
          userName="thatprakhar"
          title="A second post"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut.


"
          topic="#topic1"
        />
        <Post
          userName="thatprakhar"
          title="Another post"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie lacus et pulvinar laoreet. Sed vitae egestas velit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent ac ante pharetra, fringilla libero quis, ultrices turpis. Mauris dapibus commodo tellus, rhoncus eleifend lectus placerat ac. Fusce ante est, consequat a lorem eu, molestie varius arcu. Pellentesque maximus orci est, ut condimentum neque gravida ut."
          topic="#topic2"
        />

        <Post
          userName="thatprakhar"
          title="Last post"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          topic="#general"
        />
      </Container>
    </div>
  );
}
