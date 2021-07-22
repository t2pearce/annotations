import React, { useState, useEffect } from 'react';
import './App.css';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { OpenSeaDragonViewer2 } from './OpenSeaDragonViewer2'
import PhotoIcon from '@material-ui/icons/Photo';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {useStyles} from './ViewerStyle2.js';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import NextIcon from '@material-ui/icons/ArrowRight';

export default function Viewer2() {

  const [images, setImages] = useState([]);
    const [manifest, setManifest] = useState();
    const [title, setTitle] = useState();
  const [state, setState] = React.useState({
    question1: '',
    question2: '',
    question3: '',
  });
  const [value, setValue] = React.useState('female');
  
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  
  const handleChange2 = (event) => {
    setValue(event.target.value);
  };

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

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className = {classes.root}>
      <CssBaseline />
      <AppBar position="fixed" 
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}>
        <Toolbar>
           <Typography variant="h6" noWrap className={classes.title} align="left">
            <b>Breast Tissue Clinical Study</b>
          </Typography>
          <Typography>
            User:{' '}<b><span id="user"></span> </b>
            <span id='consolelog'></span>
            </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
        <main className={clsx(classes.content, {
                          [classes.contentShift]:open, })}>
             <div className={classes.drawerHeader} />
               <Container maxWidth="lg">
           <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={12} lg={12}>
           <Paper variant="outlined" style={{width: "75vw", align:"center", justify: "center"}}>
             <OpenSeaDragonViewer2 image={manifest} />
               </Paper>
</Grid>
              </Grid>
               </Container>
</main>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={open}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
          <FormControl className={classes.formControl} p={3}>
                              <InputLabel htmlFor="age-native-simple"> Question 1</InputLabel>
                              <Select
                                native
                                value={state.question1}
                                onChange={handleChange}
                                inputProps={{
                                  name: 'question1',
                                  id: 'age-native-simple',
                                }}
                              >
                                <option aria-label="None" value="" />
                                <option value={10}>Yes</option>
                                <option value={20}>No</option>
                                <option value={30}>N/A</option>
                              </Select>
                            </FormControl> <p></p> <p></p>
          <FormControl component="fieldset" p={3}>
      <FormLabel component="legend">Question 2</FormLabel>
      <RadioGroup aria-label="question2" name="question2" value={value} onChange={handleChange2}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
        <FormControlLabel value="N/A" control={<Radio />} label="N/A" />
      </RadioGroup>
    </FormControl> <p></p> <p></p>
        <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="age-native-simple"> Question 3</InputLabel>
                              <Select
                                native
                                value={state.question3}
                                onChange={handleChange}
                                inputProps={{
                                  name: 'question3',
                                  id: 'age-native-simple',
                                }}
                              >
                                <option aria-label="None" value="" />
                                <option value={10}>Yes</option>
                                <option value={20}>No</option>
                                <option value={30}>N/A</option>
                              </Select>
                            </FormControl> <p></p> <p></p>
          <Button variant="contained" color="primary" endIcon={<NextIcon />}>Next</Button>
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
</div>
);
}
