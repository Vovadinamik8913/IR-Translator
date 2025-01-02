import React, { useState } from 'react';
import logo from '../assets/logo.ico'; // Убедитесь, что путь к логотипу правильный
import '../styles/Header.css'; // Импорт стилей
import Login from './Login'; // Импортируем модальное окно

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления открытием модального окна

    const handleLoginClick = () => {
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
    };

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">IR TRANSLATOR</span>
            </div>
            <button className="login-button" onClick={handleLoginClick}>
                Вход / Регистрация
            </button>
            {isModalOpen && <Login onClose={handleCloseModal} />}
        </header>
    );
};

export default Header;
