import React, { useState, useEffect } from 'react';
import './App.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { OpenSeaDragonViewer } from './OpenSeaDragonViewer'
import PhotoIcon from '@material-ui/icons/Photo';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import * as styleRefs from './ViewerStyle.js';
import { useStyles } from 'react-treat';

const drawerWidth = 200;

export default function Viewer() {
  
  const [images, setImages] = useState([]);
    const [manifest, setManifest] = useState();
    const [title, setTitle] = useState();
  const styles = useStyles(styleRefs);
    
    setUserInfo();

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = await fetch("/api/profile", {
                              method: 'GET',
                              credentials: 'include',
                              headers: {'Access-Control-Allow-Credentials': 'true'}}); 
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
  
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(styles.paper, styles.fixedHeight, open && styles.paperShift);
  
  return (
    <div className={styles.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(styles.appBar, open && styles.appBarShift)}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(styles.menuButton, open && styles.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={styles.title} align="left">
            <b>Breast Tissue Clinical Study</b>
          </Typography>
          <Typography>
            User:{' '}<b><span id="user"></span> </b>
            <span id='consolelog'></span>
            </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(styles.drawerPaper, !open && styles.drawerPaperClose),
        }}
        open={open}
      >
        <div className={styles.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
<List>
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
                  <ListSubheader> {group.name} </ListSubheader>
                  {group.slides.map((slide, index) => {
                    return (
                      <ListItem button
                        key={index}
                        onClick={() => {
                          return previewImage(slide);
                        }}
                      >
                        <ListItemIcon>
                        <PhotoIcon />
                        </ListItemIcon>
                        <ListItemText
                          disableTypography
                          primary={slide.name} />
                      </ListItem>
                    );
                  })}
                </div>
              );
            })}
      </div>
</List>
      </Drawer>
        <main className={styles.content}>
        <div className={styles.appBarSpacer} />
        <Container maxWidth="lg" className={styles.container}>
           <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={fixedHeightPaper}>
                <Typography align="left">
                  Hold the <b>[SHIFT]</b> key while clicking and dragging the mouse to create a new annotation.
                  <p></p>
                </Typography>
            <Typography align="left">
               Image: <b>{title}</b>
                <p></p>
             </Typography>
            <OpenSeaDragonViewer image={manifest} />
              </Paper>
              </Grid>
              </Grid>
               </Container>
      </main>
    </div>
);
}
