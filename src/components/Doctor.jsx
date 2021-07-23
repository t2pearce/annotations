import React from "react";
import './Home.css';
import { Button, Grid, Paper } from "@material-ui/core";
import logo from './login.png';
import { ResponsiveContainer } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import {Redirect} from "react-router-dom";

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
    textAlign: 'center'
  },
  fixedHeight: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
}));
function Doctor() {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  var userRole = null;
  
   async function getUserInfo() {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        return clientPrincipal;
      }
      async function setUserInfo() {
        let  clientPrincipal =  await getUserInfo();
        userRole = clientPrincipal.userRoles;
        console.log(clientPrincipal);
      }
  
      setUserInfo();
      console.log(userRole);
  
  /* if (clientPrincipal.userRoles == 'contributor') {
    return <Redirect to="/viewer" />
  } else if (clientPrincipal.userRoles == 'reader') {
    return <Redirect to="/viewer2" />
  }*/
  
  return (
    <ResponsiveContainer maxWidth="lg" className={classes.container}>
    <Grid container spacing={3} alignItems="center">
    <Grid item xs={12} md={12} lg={12}>
      <Paper className={fixedHeightPaper}>
        <Typography align="center">
      <p> [INSERT TEXT HERE] </p>
      <p></p>
        <p>
    <Button variant="contained" href="/viewer">Operator</Button>
          <p></p>
          <Button variant="contained" href="/viewer2">Clinician</Button>
            </p>
    </Typography>
    </Paper>
    </Grid>
    </Grid>
    </ResponsiveContainer>
  );
}
export default Doctor;
