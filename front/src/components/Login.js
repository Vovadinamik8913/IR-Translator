import React, { useState } from 'react';
import '../styles/Login.css';
import { loginSite, registrationSite } from '../api/login-api';

const Login = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true); 
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const toggleModal = () => {
        setIsLogin(!isLogin);
        setErrorMessage('');
        setSuccessMessage('');
        setEmail('');
        setLogin('');
        setPassword('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLogin) {
            try {
                const data = await loginSite(login, password);
                setSuccessMessage('Вход выполнен успешно!');
                setErrorMessage('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.uuid);
                onClose();
            } catch (error) {
                console.error('Ошибка при выполнении входа:', error);
                setErrorMessage('Ошибка при входе. Проверьте логин и пароль.');
                setSuccessMessage('');
            }
        } else {
            try {
                const data = await registrationSite(login, password, email);
                setSuccessMessage('Регистрация прошла успешно!');
                setErrorMessage('');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', data.uuid);
                setIsLogin(true);
                onClose();
            } catch (error) {
                console.error('Ошибка при выполнении регистрации:', error);
                setErrorMessage('Ошибка при регистрации. Попробуйте снова.');
                setSuccessMessage('');
            }
        }
    };

    return (
        <div className="login-overlay">
            <div className="login-modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="text"
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <p onClick={toggleModal} className="toggle-text">
                    {isLogin
                        ? 'Нет аккаунта? Зарегистрируйтесь'
                        : 'Уже есть аккаунт? Войдите'}
                </p>
            </div>
        </div>
    );
};

export default Login;
