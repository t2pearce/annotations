
import React from "react";
import { Link, withRouter } from "react-router-dom";
import TypoGraphy from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function Navigation(props) {
  return (
   <List component="nav">
      <ListItem compnen="div">
        <ListItemText inset>
          <TypoGraphy color="inherit" variant="title">
            Breat Tissue Clinical Study
          </TypoGraphy>
        </ListItemText>
      </ListItem>
    </List>
  )
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired\
};

export default withRouter(Navigation);
