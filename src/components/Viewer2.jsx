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
import Questions from './Questions.jsx';
export default function Viewer2() {
	
  const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState();
  const [imageId, setImageId] = useState();
  const [title, setTitle] = useState();
  const [state, setState] = useState();
  const [index, setIndex]= useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [showStart, setShowStart] = useState(true);
  const [showNext, setShowNext] = useState(false);	
  const [showEnd, setShowEnd] = useState(false);
	var newAnswers;
	
    setUserInfo();
    useEffect(() => {
	getIndex();
        getImages();
    }, []);
	
    useEffect(() => {
        getQuestions(imageId);
    }, [imageId]);
	
	
    const getQuestions = (imageId) => {
	    	  console.log('imgaeindex', index)
	  console.log('currQues', currentQuestion)
       console.log('imageId', imageId)
       var encodedId = btoa(imageId);
       console.log('encodedId', encodedId)
       fetch("/api/questions/" + encodedId, {
		    method: 'GET',
		    credentials: 'include',
		    headers: {'Access-Control-Allow-Credentials': 'true'}})
	.then((response) => response.json())
	.then(
	       (result) => {
		    let questionsList = result;
		    if (questionsList) {
	    		console.log('questions', questionsList)
	    		setQuestions(questionsList);
			console.log('setFetchQuestions', questions)
		    }
	       },
	       (error) => {
		       console.log(error)
	       }
	       )
	  }
    
    const getIndex = () => {
	    console.log('geting index')
	fetch("/api/progress", {
		method: 'GET',
		credentials: 'include',
		headers: {'Access-Control-Allow-Credentials': 'true'}})
	    .then((response) => response.json())
	    .then(
		(result) => {
			let indices = result;
			console.log('indices', indices)
	    			setIndex(indices[0].imageIndex);
	    			setCurrentQuestion(indices[0].questionIndex);
		},
		(error) => {
			console.log(error)
		}
		)
    }
	
   const saveIndex = (imageIndex, questionIndex) => {
    let indexObj = [{ imageIndex :imageIndex, 
		     questionIndex: questionIndex}];
    if (!indexObj)
      return;
    var json = JSON.stringify(indexObj); 
	console.log('json', json);
    fetch("/api/progress", { 
          method: 'POST',
          credentials: 'include',
          headers: {'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'},
          body: json } )
      .then((response) => response.json())
      .then(
            (result) => {
              console.log(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
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
    //setManifest(image.groups[0].slides[0].slide)
    setImageId(image.groups[0].slides[0].slide.source.Image.Url)
    console.log('IMAGEID', image.groups[0].slides[0].slide.source.Image.Url)
    //getQuestions(image.groups[0].slides[0].slide.source.Image.Url)
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
	
  const handleDrawerOpen = () => {
    setOpen(true);
	  console.log('setQuestions', questions)
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
	
  const handleNext = () => {
	  if (index < images.length) {
		  setIndex(index+1);
		  console.log('index', index)
		  setManifest(images[index+1].slide)
		  setImageId(images[index+1].slide.source.Image.Url);
		  //getQuestions(imageId);
		  setCurrentQuestion(0);
		  setShowNext(false);
		  setShowScore(true);
		  saveRemoteAnswers(answers);
		  setAnswers([]);
		  saveIndex(index, currentQuestion);
	  } else {
		  setShowScore(false);
		  setShowEnd(true);
		  saveRemoteAnswers(answers);
		  saveIndex(index, currentQuestion);
	  }
  };
	
  const handleStart = () => {
	  console.log('imgaeindex', index)
	  console.log('currQues', currentQuestion)
	  setShowStart(false);
	  setShowScore(true);
	  setManifest(images[index].slide);
  };
	
  const handleAnswerOptionClick = (answerChoice, questionText) => {
    const nextQuestion = currentQuestion + 1;
	  let answerObj = {
		  questionsText: questionText,
		  answersText: answerChoice
	  }
	  saveRemoteAnswers(answerObj);
    //setAnswers([...answers, {answerObj}]);
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      console.log('answers', answers)
	    saveIndex(index, currentQuestion+1);
    } else {
      setShowScore(false);
      setShowNext(true);
	    saveIndex(index, currentQuestion+1);
    }
  };
	
const getAnswers = (imageId) => {
	console.log('imageId', imageId)
	var encodedId = btoa(imageId);
	console.log('encodedId', encodedId)
	fetch("/api/answers/" + encodedId, {
		    method: 'GET',
		    credentials: 'include',
		    headers: {'Access-Control-Allow-Credentials': 'true'}})
	.then((response) => response.json())
	.then(
	       (result) => {
		    let answersList = result;
		    return answersList;
	       },
	       (error) => {
		       console.log(error)
	       }
	 )
}
			
const saveRemoteAnswers =  (answer) => {
    console.log("saving");
    if (!newAnswers)
      return;
	if(currentQuestion > 0) {
		let answerList = getAnswers(imageId);
		console.log('getAnswers', answerList);
		let newAnswers = [...answerList, {answer}]
	}
	else {
		let newAnswers = [answer];	
	}
    var json = JSON.stringify(newAnswers); 
	console.log('json', json);
    var encodedId = btoa(imageId);
	
    fetch("/api/answers/" + encodedId , { 
          method: 'POST',
          credentials: 'include',
          headers: {'Access-Control-Allow-Credentials': 'true',
                    'Content-Type': 'application/json'},
          body: json } )
      .then((response) => response.json())
      .then(
            (result) => {
              console.log(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              console.log(error);
            }
          )
    }
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight, open && classes.paperShift);
  return (
    <div className = {classes.root}>
      <CssBaseline />
      <AppBar position="absolute" 
              className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
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
        <main className={classes.content}>
             <div className={classes.appBarSpacer} />
             <Container maxWidth="lg" className={classes.container}>
               <Grid container spacing={3} alignItems="center">
                 <Grid item xs={12} md={12} lg={12}>
                   <Paper className={fixedHeightPaper}>
			   <Typography variant="h6" align="left">
				 <p></p> <b>Image {index +1} </b>  <p></p>
				</Typography>
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
	<div className='app'>
			{showNext == true &&
			 <div className='question-section'>
     			<button onClick={handleNext} variant="contained">Next Image</ button>
			</div>}
			{showScore == true &&
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Image {index +1}</span>/{images.length}
						</div>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className='question-text'>{questions[currentQuestion].questionText}</div>
					</div>
					<div className='answer-section'>
						{questions[currentQuestion].answerOptions.map((answerOption) => (
							<button onClick={() => handleAnswerOptionClick(answerOption.answerText, questions[currentQuestion].questionText)}>{answerOption.answerText}</button>
						))}
					</div>
				</>}
			{showStart == true &&
				<div className='question-section'>
     			<button onClick={handleStart} variant="contained">START</ button>
			</div>}
			 {showEnd == true &&
				 <div className='question-section'>
					 <span>END</span>
			  </div>}
		</div>	  
       
      
</List>
      </Drawer>
</div>
);
}
