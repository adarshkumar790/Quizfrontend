import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/RegisterPage.module.css'; 

const  baseURL = 'https://quizbackend-m2ur.onrender.com'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await axios.post(`${baseURL}/api/auth/register`, { username, password });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className={styles.registerPage}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit">Register</button>
            </form>
            <div className={styles.loginRedirect}>
                <p>Already registered?</p>
                <button onClick={handleLoginRedirect} className={styles.loginButton}>Login</button>
            </div>
        </div>
    );
};

export default RegisterPage;
