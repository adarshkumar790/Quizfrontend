import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../CSS/EditQuizPage.module.css'; 
const baseURL = 'https://quizbackend-m2ur.onrender.com'

const EditQuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
                setQuiz(response.data);
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError('Failed to load quiz. Please try again.');
            }
        };

        fetchQuiz();
    }, [id]);

    const handleQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...quiz.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${baseURL}/api/quizzes/edit/${id}`, quiz, {
                headers: { 'x-auth-token': token }
            });
            navigate(`/quiz/${id}`); 
        } catch (err) {
            console.error('Error editing quiz:', err);
            setError('Failed to edit quiz. Please try again.');
        }
    };

    if (error) return <div className={styles.error}>{error}</div>;

    if (!quiz) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.editQuizPage}>
            <h1>Edit Quiz</h1>
            <form onSubmit={handleSubmit}>
                <label className={styles.label}>
                    Title:
                    <input
                        type="text"
                        value={quiz.title}
                        onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                        className={styles.input}
                    />
                </label>
                <label className={styles.label}>
                    Type:
                    <select
                        value={quiz.type}
                        onChange={(e) => setQuiz({ ...quiz, type: e.target.value })}
                        className={styles.input}
                    >
                        <option value="poll">Poll</option>
                        <option value="qa">Q&A</option>
                    </select>
                </label>
                {quiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className={styles.questionSection}>
                        <label className={styles.label}>
                            Question Text:
                            <input
                                type="text"
                                name="questionText"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                className={styles.input}
                            />
                        </label>
                        {question.options.map((option, oIndex) => (
                            <label key={oIndex} className={styles.label}>
                                Option {oIndex + 1}:
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    className={styles.input}
                                />
                            </label>
                        ))}
                        {quiz.type === 'qa' && (
                            <label className={styles.label}>
                                Correct Answer:
                                <input
                                    type="text"
                                    name="correctAnswer"
                                    value={question.correctAnswer}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                    className={styles.input}
                                />
                            </label>
                        )}
                        <label className={styles.label}>
                            Time Limit (seconds):
                            <input
                                type="number"
                                name="timeLimit"
                                value={question.timeLimit}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                                className={styles.input}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit" className={styles.saveButton}>Save Changes</button>
            </form>
        </div>
    );
};

export default EditQuizPage;
