import React, { useState, useEffect } from 'react';
import Selector from './Selector';
import Editor from '@monaco-editor/react';
import '../styles/Code.css';
import {handleCodeMount} from './MonacoMount'
import FontSize from './FontSize';
import { getLanguageCompilers, getLanguageExtension, getLanguages } from '../api/lang-api';


const CodeEditor = ({ 
  code,
  setCode,
  language,
  setLanguage,
  setCompilers,
  fileExtension,
  setFileExtension
}) => {
  const [languages, setLanguages] = useState([]);
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    try {
      const langPromise = getLanguages();
      langPromise.then((data) => {
        setLanguages(data);
        if (data.length > 0) {
          setLanguage(data[0]);
        }
      });
    } catch (error) {
        console.error('Ошибка при получении списка языков:', error);
    }
  }, []);

  // Получаем список компиляторов при изменении языка
  useEffect(() => {
    if (language) {
      try {
        const compilersPromise = getLanguageCompilers(language);
        compilersPromise.then((data) => {
          setCompilers(data);
        });
      } catch (error) {
        console.error('Ошибка при получении списка компиляторов:', error);
      }

      try {
        const extPromise = getLanguageExtension(language);
        extPromise.then((data) => {
          if (data) {
            setFileExtension(data);
          } else {
            setFileExtension('.txt');
          }
        });
      } catch (error) {
        console.error('Ошибка при получении расширения файла:', error);
        setFileExtension('.txt');
      }
    }
  }, [language]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (selectedOption) => {
    setLanguage(selectedOption.value);
    setCode('');
  };

  const handleDownloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `code${fileExtension}`;
    link.click();
  };
  
  const options = languages.map((lang) => ({
    value: lang,
    label: lang,
  }));

  const selectedOption = options.find((option) => option.value === language);
  

  return (
    <div className="window form">
      <div className="info">
        <FontSize
          setFontSize={setFontSize}
        />
        <Selector
          src={languages}
          elem={language}
          onChange={handleLanguageChange}
          text={"Language"}
        />
        <div>
          <button className="button download" onClick={handleDownloadFile}></button>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          beforeMount={handleCodeMount}
          options={{ 
            selectOnLineNumbers: true,
            fontSize: fontSize
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
