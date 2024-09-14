import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CreateQuizPage from './components/CreateQuizPage';
import EditQuizPage from './components/EditQuizPage';
import TakeQuizPage from './components/TakeQuizPage';
import QuizPage from './components/QuizPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuizPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create-quiz" element={<CreateQuizPage />} />
                <Route path="/edit/:id" element={<EditQuizPage />} />
                <Route path="/quiz/:id" element={<TakeQuizPage />} />
            </Routes>
        </Router>
    );
}

export default App;
