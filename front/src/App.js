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

    const [selectedRepresentation, setSelectedRepresentation] = useState('');
    const [representation, setRepresentation] = useState('');
    const [compilerFlags, setCompilerFlags] = useState('');
    const [compiler, setCompiler] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

    return (
        <div className="App">
            <Header
                code = {code} setCode={setCode}
                language={language} setLanguage={setLanguage}
                representation={representation} setRepresentation={setRepresentation}
                compiler={compiler} setCompiler={setCompiler}
                flags={compilerFlags} setFlags={setCompilerFlags}
                reprLanguage={selectedRepresentation} setReprLanguage={setSelectedRepresentation}
            />
            <div className="main-container">
                <CodeEditor
                    code={code} setCode={setCode}
                    setCompilers={setCompilers}
                    language={language} setLanguage={setLanguage}
                    fileExtension={fileExtension} setFileExtension={setFileExtension}
                />
                <Representaion
                    codeExtention={fileExtension}
                    language={language}
                    code={code}
                    compilers={compilers}
                    compiler={compiler} setCompiler={setCompiler}
                    compilerFlags={compilerFlags} setCompilerFlags={setCompilerFlags}
                    representation={representation} setRepresentation={setRepresentation}
                    selectedRepresentation={selectedRepresentation} setSelectedRepresentation={setSelectedRepresentation}
                />
            </div>
        </div>
    );
}

export default App;
