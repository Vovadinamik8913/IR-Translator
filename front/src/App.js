import React, {useState, useEffect} from 'react';
import CodeEditor from "./components/CodeEditor";
import Representaion from "./components/Representaion";
import './App.css';
import Header from './components/Header';

function App() {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

    return (
        <div className="App">
            <Header></Header>
            <div className="main-container">
                <CodeEditor/>
                <Representaion/>
            </div>
        </div>
    );
}

export default App;
