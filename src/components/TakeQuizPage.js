import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../CSS/TakeQuizPage.module.css';

const baseURL = 'https://quizbackend-m2ur.onrender.com'

const TakeQuizPage = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/quizzes/${id}`);
                setQuiz(response.data);
                if (response.data.questions.length > 0) {
                    setTimeLeft(response.data.questions[0].timeLimit);
                }
            } catch (err) {
                console.error('Error fetching quiz:', err.response ? err.response.data : err.message);
                setError('Failed to load quiz. Please try again.');
            }
        };

        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0) {
            handleNextQuestion();
        }
    }, [timeLeft]);

    const handleAnswerChange = (e) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = e.target.value;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(quiz.questions[currentQuestionIndex + 1].timeLimit);
        } else {
            submitQuiz();
        }
     };

    const submitQuiz = async () => {
        try {
            const response = await axios.post(`${baseURL}/api/quizzes/take/${id}`, { answers: userAnswers });
            console.log('Quiz results:', response.data);
            setScore(response.data.score);
        } catch (err) {
            console.error('Error submitting quiz:', err.response ? err.response.data : err.message);
            setError('Failed to submit quiz. Please try again.');
        }
    };

    if (error) return <div>{error}</div>;

    if (!quiz) return <div>Loading...</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className={styles.takeQuizPage}>
            <h1>{quiz.title}</h1>
            <p>Question {currentQuestionIndex + 1} / {quiz.questions.length}</p>
            {currentQuestion && (
                <div className={styles.questionContainer}>
                    <p>{currentQuestion.questionText}</p>
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} className={styles.option}>
                            <input
                                type="radio"
                                name="answer"
                                value={option.value}
                                onChange={handleAnswerChange}
                                checked={userAnswers[currentQuestionIndex] === option.value}
                                disabled={timeLeft === 0} // Disable when time is up
                            />
                            {option.type === 'image' ? (
                                <img 
                                    src={option.value} 
                                    alt={`Option ${index + 1}`} 
                                    className={styles.optionImage} 
                                />
                            ) : option.value}
                        </div>
                    ))}
                    <p className={styles.timer}>Time Left: {timeLeft}s</p>
                    <button onClick={handleNextQuestion} disabled={timeLeft === 0}>
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Submit'}
                    </button>
                </div>
            )}
            {score !== null && (
                <div className={styles.score}>
                    <h2>Your Score: {score}</h2>
                </div>
            )}
        </div>
    );
};

export default TakeQuizPage;
