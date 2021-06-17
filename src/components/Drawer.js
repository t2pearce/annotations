import React from "react";
import PropTypes from "prop-types";
import Drawer from "@material-ui/core/Drawer";

const DrawerRight = props => {
  const { classes } = props;
  return (
    <Drawer {...props}>
      <div tabIndex={0}>{props.children}</div>
    </Drawer>
  );
};

export default DrawerRight;
