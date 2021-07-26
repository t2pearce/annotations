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

  useEffect(() => {
	getQuestions();
  }, []);
	
  const getQuestions = async () => {
    const response = await fetch("/api/questions" + imageId, {
                              method: 'GET',
                              credentials: 'include',
                              headers: {'Access-Control-Allow-Credentials': 'true'}}); 
    let questionList = await response.json();
    setQuestions(questionList)
  };
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState();
  
  const handleAnswerOptionClick = (isCorrect) => {
    if(isCorrect) {
      setProgress(progress +1);
    }
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
					You scored {progress} out of {questions.length}
				</div>
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currentQuestion + 1}</span>/{questions.length}
						</div>
						<div className='question-text'>{questions[currentQuestion].questionText}</div>
					</div>
					<div className='answer-section'>
						{questions[currentQuestion].answerOptions.map((answerOption) => (
							<button className='question-button' onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};
