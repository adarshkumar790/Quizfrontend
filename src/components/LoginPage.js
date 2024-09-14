import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/LoginPage.module.css'; 

const baseURL = 'https://quizbackend-m2ur.onrender.com'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseURL}/api/auth/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/create-quiz');
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className={styles.loginPageContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h1>Login</h1>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
