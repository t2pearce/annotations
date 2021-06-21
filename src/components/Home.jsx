import React from "react";
import { Link, withRouter } from "react-router-dom";
import './Home.css';
import { Button, Grid, Paper } from "@material-ui/core";
import logo from './login.png';
import { ResponsiveContainer } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: "50vh",
    width: "50vw",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
}));

function Home() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <ResponsiveContainer maxWidth="lg" className={classes.container}>
    <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12} justify="center">
      <Paper className={fixedHeightPaper}>
    <Typography align="center">
      <p> [INSERT TEXT HERE] </p>
      <p></p>
      <p><b>Please Login to Your Microsoft Azure Account Below:</b></p>
      <p></p>
      <img className="photo" src={logo} />
        <p> </p>
        <p>
    <Button variant="contained" href="/.auth/login/aad?post_login_redirect_uri=https://black-flower-0f7508210.azurestaticapps.net/viewer">Login</Button>
          <p></p>
          <p>Try to open this <a href="viewer">View OpenSeaDragon</a></p>
            </p>
    </Typography>
    </Paper>
    </Grid>
    </Grid>
    </ResponsiveContainer>
  );
}

export default Home;
