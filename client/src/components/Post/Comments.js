// Credits : https://github.com/gunasai/material-ui-comments
import React, { Component } from "react";
import Comment from "./Comment";
import { CircularProgress } from "@material-ui/core";

const API_URL = "http://127.0.0.1:5000";

export default class Comments extends Component {
  state = {
    comments: [],
    isFetching: true,
  };

  fetchData = (showLoadingBar) => {
    this.setState({
      isFetching: showLoadingBar
    })
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        auth_token: localStorage.getItem("auth_token"),
        post_id: this.props.postId
      }
    };
    console.log(requestOptions.headers.post_id);
    fetch(API_URL + "/get_commented_post_by_id", requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({
        isFetching: false,
        comments: data
      })
    })
    .catch(err => {
      console.log(err);
      this.setState({
        isFetching: false
      })
    })
  }

  componentDidMount() {
    this.fetchData(true);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postId !== this.props.postId) {
      this.fetchData(true);
    }
  }

  render() {
    const { comments, isFetching } = this.state;
    return isFetching ? <><CircularProgress /> </>
    : <Comment comments={comments} />;
  }
}