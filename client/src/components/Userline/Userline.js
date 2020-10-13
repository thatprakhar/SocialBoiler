import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
  } from "react-router-dom";

function Userline() {

    return localStorage.getItem("username")?
    (
        <div>This is userline page</div>
    ):
    (
        <Redirect to="/login"></Redirect>
    )
    
}

export default Userline

