import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../CSS/CreateQuizPage.module.css'; 
const baseURL = 'https://quizbackend-m2ur.onrender.com'

const CreateQuizPage = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('poll');
    const [questions, setQuestions] = useState([{
        questionText: '',
        options: [{ type: 'text', value: '' }, { type: 'text', value: '' }, { type: 'text', value: '' }, { type: 'text', value: '' }],
        correctAnswer: '',
        timeLimit: 30
    }]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleQuestionChange = (index, e) => {
        const { name, value } = e.target;
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [name]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex][field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            questionText: '',
            options: [{ type: 'text', value: '' }, { type: 'text', value: '' }, { type: 'text', value: '' }, { type: 'text', value: '' }],
            correctAnswer: '',
            timeLimit: 30 
        }]);
    };

    const validateQuiz = () => {
        if (!title) {
            setError('Quiz title is required.');
            return false;
        }
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText) {
                setError(`Question ${i + 1} text is required.`);
                return false;
            }
            if (questions[i].options.some(option => !option.value)) {
                setError(`All options for question ${i + 1} must be filled.`);
                return false;
            }
            if (type === 'qa' && !questions[i].correctAnswer) {
                setError(`Correct answer for question ${i + 1} is required.`);
                return false;
            }
            if (!questions[i].timeLimit || questions[i].timeLimit <= 0) {
                setError(`Question ${i + 1} must have a valid time limit greater than zero.`);
                return false;
            }
        }
        setError(null); 
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateQuiz()) {
            toast.error('Please fix the errors in the quiz form.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found.');
                return;
            }

            const response = await axios.post(`${baseURL}/api/quizzes/create`, 
                { title, type, questions }, 
                { headers: { 'x-auth-token': token } }
            );

            toast.success('Quiz created successfully!');
            navigate('/');
        } catch (err) {
            toast.error('Failed to create quiz. Please try again.');
            setError(err.response?.data?.error || 'Failed to create quiz. Please try again.');
        }
    };

    return (
        <div className={styles.createQuizPage}>
            <h1>Create a New Quiz</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Type:
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="poll">Poll</option>
                        <option value="qa">Q&A</option>
                    </select>
                </label>
                {questions.map((question, qIndex) => (
                    <div key={qIndex}>
                        <label>
                            Question Text:
                            <input
                                type="text"
                                name="questionText"
                                value={question.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                            />
                        </label>
                        {question.options.map((option, oIndex) => (
                            <div key={oIndex}>
                                <label>
                                    Option {oIndex + 1}:
                                    <select
                                        value={option.type}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'type', e.target.value)}
                                    >
                                        <option value="text">Text</option>
                                        <option value="image">Image URL</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={option.value}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'value', e.target.value)}
                                    />
                                </label>
                            </div>
                        ))}
                        {type === 'qa' && (
                            <label>
                                Correct Answer:
                                <input
                                    type="text"
                                    name="correctAnswer"
                                    value={question.correctAnswer}
                                    onChange={(e) => handleQuestionChange(qIndex, e)}
                                />
                            </label>
                        )}
                        <label>
                            Time Limit (seconds):
                            <input
                                type="number"
                                name="timeLimit"
                                value={question.timeLimit}
                                onChange={(e) => handleQuestionChange(qIndex, e)}
                            />
                        </label>
                    </div>
                ))}
                <button type="button" onClick={addQuestion}>Add Question</button>
                <button type="submit">Create Quiz</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            <ToastContainer />
        </div>
    );
};

export default CreateQuizPage;
