import React from "react";
import './Home.css';
import { Button, Grid, Paper } from "@material-ui/core";
import logo from './login.png';
import { ResponsiveContainer } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';

export default function Doctor() {
  async function getUserInfo() {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        return clientPrincipal;
      }
  
  const redirect = null;
  
  if (clientPrincipal.userRoles == 'operator') {
    redirect = "/viewer";
  } else if (clientPrincipal.userRoles == 'operator') {
    redirect = "viewer2";
  }
    
  return (
    <Switch>
    <RedirectWithStatus status={301} from="/doctor" to="{redirect}" />
    </Switch>
   );
}
