import React from "react";
import { Link, withRouter } from "react-router-dom";
import './Home.css';
import { Button, Box } from "@material-ui/core";
import logo from './login.png';

function Home() {
  return (
    <ResponsiveContainer maxWidth="lg">
    <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12}>
      <Paper>
    <div class="center">
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
    </div>
    </Paper>
    </Grid>
    </Grid>
    </ResponsiveContainer>
  );
}

export default Home;
