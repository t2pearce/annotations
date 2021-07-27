/*const Questions = ({ imageId }) => {
  /*const getQuestions = asy () => {
    fetch("/api/questions/" + imageId , { 
                  method: 'GET',
                  credentials: 'include',
                  headers: {'Access-Control-Allow-Credentials': 'true'}
                })
          let questions = response.json();
  }; */

import React, {useState, useEffect} from 'react';
import './Questions.css';

export default function Questions({imageId}) {

const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState();
		
  const getQuestions = () => {
    fetch("/api/questions/" + imageId, {
            method: 'GET',
            credentials: 'include',
            headers: {'Access-Control-Allow-Credentials': 'true'}
    })
      .then((response) => response.json())
      .then(
	    (result) => {
		    let questionsList = result;
		    if (questionsList) {
			    setQuestions(questionsList);
			    console.log(questionsList);
		    }
	    },
	    (error) => {
		    console.log(error);
	    }
	    )
  }
  
  getQuestions();
console.log(questions);
  
  const handleAnswerOptionClick = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowProgress(true);
    }
  };
  return (
		<div className='app'>
			{showProgress ? (
				<div className='score-section'>
					You scored {progress} out of 4
				</div>
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/4
						</div>
						<div className='question-text'>{questions[currentQuestion].questionText}</div>
					</div>
					<div className='answer-section'>
						{questions[currentQuestion].answerOptions.map((answerOption) => (
							<button className='question-button' onClick={() => handleAnswerOptionClick()}>{answerOption.answerText}</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};
