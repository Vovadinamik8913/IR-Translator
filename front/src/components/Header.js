import React, { useState } from 'react';
import logo from '../assets/logo.ico';
import '../styles/Header.css';
import Login from './Login';
import Projects from './Projects';

const Header = ({
    code, setCode,
    language, setLanguage,
    representation, setRepresentation,
    reprLanguage, setReprLanguage,
    compiler, setCompiler,
    flags, setFlags
}) => {
    const [isModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
    
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    const handleCloseLogin = () => setIsLoginModalOpen(false);

    const handleOpenProjects = () => setIsProjectsModalOpen(true);
    const handleCloseProjects = () => setIsProjectsModalOpen(false);

    return (
        <header className="header">
            <button className="button project" onClick={handleOpenProjects}>
            </button>
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-image" />
                <span className="logo-text">IR TRANSLATOR</span>
            </div>
            <button className="login-button" onClick={handleOpenLogin}>
                Вход / Регистрация
            </button>
            {isModalOpen && <Login onClose={handleCloseLogin} />}
            {isProjectsModalOpen && 
            <Projects
                code={code}
                setCode={setCode}
                representation={representation}
                setRepresentation={setRepresentation}
                language={language}
                setLanguage={setLanguage}
                reprLanguage={reprLanguage}
                setReprLanguage={setReprLanguage}
                compiler={compiler}
                setCompiler={setCompiler}
                flags={flags}
                setFlags={setFlags}
                onClose={handleCloseProjects} 
            />}
        </header>
    );
};

export default Header;
