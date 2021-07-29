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
import './Questions.css';

export default function Viewer2() {

  const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState();
  const [imageId, setImageId] = useState();
  const [title, setTitle] = useState();
  const [state, setState] = useState();
  const [index, setIndex]= useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState();

    setUserInfo();

    useEffect(() => {
        getImages();
    }, []);
	
    const getQuestions = async(imageId) => {
	    console.log('imageId', imageId)
       var encodedId = btoa(imageId);
	    console.log('encodedId', encodedId)
       const response = await fetch("/api/questions/" + encodedId, {
		    method: 'GET',
		    credentials: 'include',
		    headers: {'Access-Control-Allow-Credentials': 'true'}});;
	      let questionsList = await response.json();
	    console.log('questions', questionsList)
	    setQuestions(questionsList);
	  }
	
  const getImages = async () => {
    const response = await fetch("/api/profile", {
                              method: 'GET',
                              credentials: 'include',
                              headers: {'Access-Control-Allow-Credentials': 'true'}}); 
    let image = await response.json();
    console.log('image', image)
    console.log('groups', image.groups)
    console.log('slides', image.groups[0].slides)
    setImages(image.groups[0].slides)
    setManifest(image.groups[0].slides[0].slide)
    setImageId(image.groups[0].slides[0].slide.source.Image.Url)
    console.log('IMAGEID', image.groups[0].slides[0].slide.source.Image.Url)
    getQuestions(image.groups[0].slides[0].slide.source.Image.Url)
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
  const [open, setOpen] = useState(false);
	
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
	
  const handleNext = () => {
	  setIndex(index+1);
	  console.log('index', index)
	  setManifest(images[index].slide)
	  setImageId(images[index].slide.source.Image.Url);
	  getQuestions(imageId);
  };
	
  const handleAnswerOptionClick = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowProgress(true);
    }
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
          
<List>
	<Typography>{questions[0].questionText}</Typography>
		  
})}
     <Button onClick={handleNext}>Next Image</ Button>  
      
</List>
      </Drawer>
</div>
);
}
