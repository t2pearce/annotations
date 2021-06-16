import React, { useState, useEffect } from 'react';
import './App.css';
import { OpenSeaDragonViewer } from './OpenSeaDragonViewer';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
//import ToggleButton from '@material-ui/core/ToggleButton';
import styled from 'styled-components';

function Viewer() {
    const [images, setImages] = useState([]);
    const [manifest, setManifest] = useState();
    const [active, setActive] = useState();
    const [title, setTitle] = useState();
  
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
    
    const [openCollapse, setOpenCollapse] = useState(false);
    
    function handleOpenSettings(){
        setOpenCollapse(!openCollapse);
    }


  return (
     
      
    <div className="viewer"
         style={{
       display: "flex",
       justifyContent:'space-between'
       }}
    >
         <Drawer>
        <ListItem button on Click={handleOpenSetings}>
            <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {openCollapse ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText inset primary="Starred" />
              </ListItem>
            </List>
          </Collapse>
        </Drawer>
        
      <div>
          {images.map((group, index) => {
              return (
                <div
                style={{
                  display:"flex",
                  flexDirection:'column'
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
              );
            })}
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
