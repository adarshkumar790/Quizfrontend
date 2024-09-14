import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Navbar.module.css'; 

const Navbar = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <nav className={styles.navbar}>
            <h1 className={styles.logo}>QuizApp</h1>
            <button onClick={handleRegisterClick} className={styles.registerButton}>
                Register
            </button>
        </nav>
    );
};

export default Navbar;
