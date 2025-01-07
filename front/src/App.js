import React, {useState, useEffect} from 'react';
import CodeEditor from "./components/CodeEditor";
import Representaion from "./components/Representaion";
import './App.css';
import Header from './components/Header';

function App() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('');
    const [fileExtension, setFileExtension] = useState("");
    const [compilers, setCompilers] = useState([]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

    return (
        <div className="App">
            <Header/>
            <div className="main-container">
                <CodeEditor
                    code={code}
                    setCode={setCode}
                    setCompilers={setCompilers}
                    language={language}
                    setLanguage={setLanguage}
                    fileExtension={fileExtension}
                    setFileExtension={setFileExtension}
                />
                <Representaion
                    codeExtention={fileExtension}
                    language={language}
                    code={code}
                    compilers={compilers}
                />
            </div>
        </div>
    );
}

export default App;
