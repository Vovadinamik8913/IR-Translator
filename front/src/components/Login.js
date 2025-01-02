import React, { useState } from 'react';
import '../styles/Login.css'; // Стили для модального окна

const Login = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией

    const toggleModal = () => {
        setIsLogin(!isLogin); // Переключаем режим
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Добавьте логику обработки формы входа/регистрации
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input type="text" placeholder="Имя пользователя" required />
                    )}
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Пароль" required />
                    <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                </form>
                <p onClick={toggleModal} className="toggle-text">
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </p>
            </div>
        </div>
    );
};

export default Login;
