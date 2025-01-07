import React, { useState } from 'react';
import '../styles/Login.css'; // Стили для модального окна

const Login = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией
    const [email, setEmail] = useState(''); // Email пользователя (только для регистрации)
    const [login, setLogin] = useState(''); // Логин
    const [password, setPassword] = useState(''); // Пароль
    const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке
    const [successMessage, setSuccessMessage] = useState(''); // Сообщение об успехе

    const toggleModal = () => {
        setIsLogin(!isLogin); // Переключаем режим
        setErrorMessage(''); // Сбрасываем сообщения при переключении
        setSuccessMessage('');// Очищаем поля при переключении
        setEmail('');
        setLogin('');
        setPassword('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLogin) {
            // Запрос на вход
            try {
                const buildFormData = new FormData();
                buildFormData.append("login", login);
                buildFormData.append("password", password);
                const response = await fetch('/user/login', {
                    method: 'POST',
                    body: buildFormData
                });

                const data = await response.json();

                if (response.ok) {
                    // Если вход успешен
                    setSuccessMessage('Вход выполнен успешно!');
                    setErrorMessage('');
                    // Сохраняем UUID или выполняем другие действия
                    const userUUID = data;
                    console.log('User UUID:', userUUID);
                    // Например, сохраняем UUID в localStorage
                    localStorage.setItem('userUUID', userUUID);
                    // Закрываем модальное окно или перенаправляем пользователя
                    onClose();
                } else {
                    // Если произошла ошибка
                    setErrorMessage(data.message || 'Ошибка при входе. Проверьте логин и пароль.');
                    setSuccessMessage('');
                }
            } catch (error) {
                console.error('Ошибка при выполнении входа:', error);
                setErrorMessage('Произошла ошибка при попытке входа.');
                setSuccessMessage('');
            }
        } else {
            // Запрос на регистрацию
            try {
                const buildFormData = new FormData();
                buildFormData.append("login", login);
                buildFormData.append("password", password);
                buildFormData.append("email", email);
                const response = await fetch('/user/registration', {
                    method: 'POST',
                    body: buildFormData
                });
                const data = await response.json();

                if (response.ok) {
                    // Если регистрация успешна
                    setSuccessMessage('Регистрация прошла успешно!');
                    setErrorMessage('');
                    // Сохраняем UUID или выполняем другие действия
                    const userUUID = data;
                    console.log('User UUID:', userUUID);
                    // Например, сохраняем UUID в localStorage
                    localStorage.setItem('userUUID', userUUID);
                    // Переключаемся на режим входа или закрываем модальное окно
                    setIsLogin(true);
                } else {
                    // Если произошла ошибка
                    setErrorMessage(data.message || 'Ошибка при регистрации. Попробуйте снова.');
                    setSuccessMessage('');
                }
            } catch (error) {
                console.error('Ошибка при выполнении регистрации:', error);
                setErrorMessage('Произошла ошибка при попытке регистрации.');
                setSuccessMessage('');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
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
