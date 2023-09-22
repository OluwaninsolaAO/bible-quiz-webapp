import React, { useState } from "react";
import "./App.scss";
import LandingPage from "./pages/Landing Page/LandingPage";
import QuestionPage from "./pages/Question Page/QuestionPage";
import ResultPage from "./pages/Result Page/ResultPage";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState(false);

  const handleUserSubmit = (userData) => {
    setUser(userData);
    setQuiz(true);
  };

  const handleQuizSubmit = async (userAnswers) => {
    try {
      // Make a POST request to send user answers to the API
      await axios.post('http://kamvamindpal.com/v1/questions', { answers: userAnswers });

      // Update user state with answers
      setUser(prev => ({ ...prev, answers: userAnswers }));

      // Set quiz to false to move to the result page
      setQuiz(false);
  } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again later.');
  }
  };

  const handleQuizRestart = () => {
    setUser(null);
    setQuiz(false);
  };

  return (
    <div className="app">
      {user == null ? (
        <LandingPage onUserSubmit={handleUserSubmit} />
      ) : quiz ? (
        <QuestionPage onQuizSubmit={handleQuizSubmit} />
      ) : (
        <ResultPage answers={user.answers} onQuizRestart={handleQuizRestart} />
      )}
    </div>
  );
}

export default App;
