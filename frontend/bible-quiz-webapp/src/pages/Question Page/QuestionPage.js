import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Loader from "react-loaders";
import "./QuestionPage.scss";

function QuestionPage(props) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

    // method to fetch the questions from the API
  const fetchQuestions = async () => {
    try {
      // Make a GET request to the API endpoint
      const response = await axios.get(
        "http://kamvamindpal.com/v1/questions"
      );
      // Set the questions state with the data
      setQuestions(response.data.data.questions);
      console.log(response.data.data.questions)

      // Set the loading state to false
        setLoading(false);
    } catch (error) {
      // Handle the error
      console.error(error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const [backgroundImageIndex, setBackgroundImageIndex] = useState(0);

    const backgroundImages = useMemo(() => [
        'url(https://images.unsplash.com/photo-1600546706018-9e1267462ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdvcmQlMjBvZiUyMEdvZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60)',
        'url(https://img.freepik.com/premium-photo/happy-epiphany-day-three-kings-day-christian-feast-day-generative-ai_870262-12465.jpg?size=626&ext=jpg&ga=GA1.1.1874357867.1690841151&semt=ais)',
        'url(https://img.freepik.com/free-photo/christian-cross-nature_23-2150592223.jpg?size=626&ext=jpg&ga=GA1.1.1874357867.1690841151&semt=ais)',
        'url(https://img.freepik.com/premium-photo/happy-epiphany-day-three-kings-day-christian-feast-day-generative-ai_870262-12465.jpg?size=626&ext=jpg&ga=GA1.1.1874357867.1690841151&semt=ais)',
    ], []);

    // A function to change background image
    const changeBackground = useCallback((increment) => {
        const newIndex = (backgroundImageIndex + increment + backgroundImages.length) % backgroundImages.length;
        setBackgroundImageIndex(newIndex);
        console.log(backgroundImageIndex)
    },[backgroundImageIndex, backgroundImages]);
    
    useEffect(() => {
        console.log("useEffect triggered"); 
        const interval = setInterval(() => {
            changeBackground(1);
        }, 9000); 
    
        return () => clearInterval(interval); // Clear the interval on component unmount
    }, [changeBackground]);

    const handleAnswer = (e) => {
        const value = e.target.value;
        // Update the answers state with the value at the current index
            setAnswers((prev) => {
        return [...prev.slice(0, index), value, ...prev.slice(index + 1)];
        });
    };

    // Define a function to handle the next button click
    const handleNext = () => {
        // Check if the user has answered the current question
        if (answers[index] == null) {
            alert("Please select an answer before proceeding");
        } else {
            setIndex((prev) => prev + 1);
        }
    };

  // Define a function to handle the submit button click
    const handleSubmit = () => {
    // Check if the user has answered all the questions
        if (answers.length < questions.length) {
        alert("Please answer all the questions before submitting");
        } else {
        // Pass the user answers to the parent component
            props.onQuizSubmit(answers);
        }
    };

  // Use useEffect hook to fetch the questions when the component mounts
    useEffect(() => {
        fetchQuestions();
    }, []);

  return (
    <div 
    className="landing-page"
        style={{
            backgroundImage: `radial-gradient(circle, rgba(15,4,71,0.0984768907563025) 0%, rgba(7,4,48,0.7595413165266106) 58%), ${backgroundImages[backgroundImageIndex]}`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        }}>
      {loading ? (
        <div><Loader/> </div>
      ) : (
        <div className="question-center">
            <h1>Quiz</h1>
            <p>
                Question {index + 1} of {questions.length}
            </p>
            {questions.length > 0 && (
                <div className="question">
                <h2>{questions[index].text}</h2>
                <div className="options">
                    {questions[index].answers.map((option, i) => (
                    <div key={option.id} className="option">
                        <input
                        type="radio"
                        id={`option-${i}`}
                        name="answer"
                        value={option.text}
                        checked={answers[index] === option.text}
                        onChange={handleAnswer}
                        />
                        <label htmlFor={`option-${i}`}>{option.text}</label>
                    </div>
                    ))}
                </div>
                </div>
            )}
          {index === questions.length - 1 ? (
            <button onClick={handleSubmit}>Submit</button>
          ) : (
            <button onClick={handleNext}>Next</button>
          )}
        </div>
      )}
    </div>
  );
}


export default QuestionPage;
