import React from 'react';
import { Link } from 'react-router-dom';
// import './HomePage.module.css'; // Import modular CSS

const HomePage = () => (
    <div className="home-page">
        <h1>Welcome to the Quiz Builder</h1>
        <Link to="/create-quiz" className="button">Create Quiz</Link>
        <Link to="/login" className="button">Login</Link>
        <Link to="/register" className="button">Register</Link>
        <Link to="/quizzes" className="button">Browse Quizzes</Link>
    </div>
);

export default HomePage;
