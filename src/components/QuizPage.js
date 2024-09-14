import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/QuizPage.module.css';

const baseURL = 'https://quizbackend-m2ur.onrender.com'

const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/quizzes`);
                setQuizzes(response.data);
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Failed to load quizzes. Please try again.');
            }
        };

        fetchQuizzes();
    }, []);

    const handleQuizClick = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleShareClick = (quizId) => {
        const shareableLink = `${baseURL}/quiz/${quizId}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => alert('Link copied to clipboard!'))
            .catch((err) => console.error('Failed to copy link:', err));
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleEditClick = (quizId) => {
        navigate(`/edit/${quizId}`);
    };

    const isTrending = (quizImpressions) => quizImpressions > 10;

    if (error) return <div className={styles.error}>{error}</div>;

    if (!quizzes.length) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.quizPage}>
            <header className={styles.header}>
                <h1>All Quizzes</h1>
                <button onClick={handleRegisterClick} className={styles.registerButton}>Register</button>
            </header>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz._id} className={styles.quizItem}>
                        <div className={styles.quizContent}>
                            <h2 onClick={() => handleQuizClick(quiz._id)}>{quiz.title}</h2>
                            {isTrending(quiz.impressions) && <span className={styles.trending}>Trending</span>}
                        </div>
                        <div className={styles.quizActions}>
                            <button onClick={() => handleShareClick(quiz._id)} className={styles.shareButton}>Share</button>
                            <button onClick={() => handleEditClick(quiz._id)} className={styles.editButton}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizPage;
