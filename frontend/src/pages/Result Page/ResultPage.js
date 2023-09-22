import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Loader from "react-loaders";
import { useMemo } from "react";

function ResultPage(props) {
    const [results, setResults] = useState([]);
    const [correct, setCorrect] = useState([]);
    const [loading, setLoading] = useState(true);

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


    // A function to fetch the results from the API
    const fetchResults = useCallback(async () => {
        try {
            // Making a GET request to the API endpoint
            const response = await axios.get('http://kamvamindpal.com/v1/questions');
            // Set the results state with the data
            setResults(response.data.data.questions);
            // Set the correct state with the number of correct answers
            setCorrect(response.data.data.questions.filter(result => result.correct).length);
            // Set the loading state to false
            setLoading(false);
        } catch (error) {
            // Handle the error
            console.error(error);
            alert('Something went wrong. Please try again later.');
        }
    }, []);

    // A function that handles restart
    const handleRestart = () => {
        props.onQuizRestart();
    };

    // Use effect hook to fetch the results when the component mounts
    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

  return (
    <div className="result-page"
        style={{
            backgroundImage: `radial-gradient(circle, rgba(15,4,71,0.0984768907563025) 0%, rgba(7,4,48,0.   7595413165266106) 58%), ${backgroundImages[backgroundImageIndex]}`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        }}>
        {loading ? (
            <Loader type='pacman'/>
        ) : (
            <div className="result-center">
                <h1>Quiz Result</h1>
                <p>
                    You scored {correct} out of {results.length}
                </p>
                <div className="results">
                    {results.map((result, i) => (
                        <div key={i} className="result">
                            <h2>{result.question}</h2>
                            <p>
                                Your answer:{" "}
                                <span className={result.correct ? "green" : "red"}>
                                    {result.answer}
                                </span>
                            </p>
                        {result.correct ? null : (
                        <p>
                            Correct answer:{" "}
                            <span className="green">{result.correctAnswer}</span>
                        </p>
                    )}
                </div>
            ))}
        </div>
        <button onClick={handleRestart}>Restart</button>
            </div>
        )}
    </div>
  );
}

export default ResultPage;
