import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { OpenSeaDragonViewer } from './OpenSeaDragonViewer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';

const useStyles= makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

function Viewer() {
    const classes = useStyles();
    const [images, setImages] = useState([]);
    const [manifest, setManifest] = useState();
    const [active, setActive] = useState();
    const [title, setTitle] = useState();
    const [state, setState] = useState({
        left: false
    });
    
    const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
    
    const list = (anhor) => (
        <div
            className={clasx(classes.list, {
                [classes.fullList]: anchor == 'top' || anchor ==='bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
         >
             <div>
          {images.map((group, index) => {
              return (
                <div
                style={{
                  display:"flex",
                  flexDirection:'column',
                  flexWrap:'wrap'
                  }}
                >
                <Divider />
                <h3 key={index}>{group.name}</h3>
                  {group.slides.map((slide, index) => {
                    return (
                      <ButtonToggle
                        key={index}
                        active={active === slide}
                        onClick={() => { setActive(slide);
                          return previewImage(slide);
                        }}
                      >
                        {slide.name}
                    </ButtonToggle>
                    );
                  })}
                </div>
          </div>
  
    setUserInfo();

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = await fetch("https://miradortest.z13.web.core.windows.net/pictures3.json") //"/api/deepzoom/pictures3.json"
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


  return ( 
    <div className="viewer">
        <div>
      {['left'].map((anchor) => (
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
      <div>
          <Box m={3}>
              <Typography align="left">
                  Image: <b>{title}</b>
                </Typography>
          <Typography align="right">
            User:{' '}<b><span id="user"></span> </b>
            <span id='consolelog'></span>
            </Typography>
            </Box>
          <Box m={3} pt={2}>
            <OpenSeaDragonViewer image={manifest} />
          </Box>
      </div>
    </div>
  );
}

export default Viewer;
