import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        SocialBoiler
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function ForgotPassword() {
  const history = useHistory();
  const classes = useStyles();
  const API_URL = "http://127.0.0.1:5000";
  const [email, setEmail] = useState("");
  const [emaiConfirm, setEmailConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  function handleSubmit(e) {
    e.preventDefault();

    if (email !== emaiConfirm) {
      setError(true);
      setErrorMessage("Emails do not match.");
      return;
    } else {
      setError(false);
      setErrorMessage("");
    }

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        email: "asd"
      }
    };
    fetch(API_URL + "/forgotpass", requestOptions)
      .then(res => {
        setError(false);
        setMessage(
          "If an account exists with the given email address, we'll send a password recovery link."
        );
      })
      .catch(err => {
        setError(true);
        setMessage("");
        setErrorMessage("Could not connect to server. Try again later.");
      });
  }

  function goBack() {
    history.push("/login");
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password?
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button color="primary" onClick={goBack}>
                <ArrowBackIosIcon />
                Go Back
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="confirm-email"
                label="Confirm Email Address"
                name="confirm-email"
                autoComplete="email"
                onChange={e => setEmailConfirm(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Send Password Reset Link
          </Button>
          {message !== "" ? (
            <Typography component="h6" variant="h6" color="textPrimary">
              {message}
            </Typography>
          ) : (
            <div></div>
          )}
          {error ? (
            <Typography component="h6" variant="h6" color="error">
              {errorMessage}
            </Typography>
          ) : (
            <div></div>
          )}
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
