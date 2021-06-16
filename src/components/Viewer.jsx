import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import styled from 'styled-components';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function Viewer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState();
  const [active, setActive] = useState();
  const [title, setTitle] = useState();
  
  setUserInfo();

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = await fetch("api/deepzoom/pictures3.json") //"https://miradortest.z13.web.core.windows.net/pictures3.json"
    let image = await response.json();
    console.log('image', image)
    setImages(image.groups)
  };

  const previewImage = async (slide) => {
    setManifest(slide.slide);
    setTitle(slide.name);
  };

    async function getUserInfo() {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        return clientPrincipal;
      }

      async function setUserInfo() {
        let  clientPrincipal =  await getUserInfo();

        document.getElementById("user").innerHTML = clientPrincipal.userDetails;
        console.log(clientPrincipal);
      }

      const Button = styled.button`
        background-color: black;
        color: white;
        font-size: 20px;
        padding: 10px 60px;
        border-radius: 0px;
        margin: 0px 0px;
        cursor: pointer;
        &:disabled {
          color: grey;
          opacity: 0.7;
          cursor: default;
        }
      `;

      const ButtonToggle = styled(Button)`
        opacity: 0.6;
        ${({ active }) =>
          active &&
          `
          opacity: 1;
        `}
      `;

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {images.map((group, index) => {
          <Typography>key={index}>{group.name}</Typography>
          {group.slides.map((slide, index) => {
            <ListItem button key={slide.name}>
            <ListItemText primary={slide.name} />
              }}
          </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
