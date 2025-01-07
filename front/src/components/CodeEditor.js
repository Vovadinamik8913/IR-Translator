import React, { useState, useEffect } from 'react';
import Selector from './Selector';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';
import {handleCodeMount} from './MonacoMount'


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

  // Получаем список языков при загрузке компонента
  useEffect(() => {
    fetch('/lang/languages', {
      method: 'POST', // Изменили метод на POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Тело запроса можно оставить пустым или добавить необходимые данные
    })
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
        // Устанавливаем первый язык из списка как выбранный
        if (data.length > 0) {
          setLanguage(data[0]);
        }
      })
      .catch((error) => {
        console.error('Ошибка при получении списка языков:', error);
      });
  }, []);

  // Получаем список компиляторов при изменении языка
  useEffect(() => {
    if (language) {

      const buildFormData = new FormData();
      buildFormData.append("lang", language);

      fetch('/lang/compilers', {
        method: 'POST', // Изменили метод на POST
        body: buildFormData // Передаем выбранный язык в теле запроса
      })
        .then((response)  => {
          if (!response.ok) {
            console.log("empty");
          }
          return response.json();
        })
        .then((data) => {
          setCompilers(data);
        })
        .catch((error) => {
          console.error('Ошибка при получении списка компиляторов:', error);
        });

        // Получаем расширение файла
      fetch('/lang/code-extension', {
        method: 'POST',
        body: buildFormData
      })
        .then((response) => response.text())
        .then((data) => {
          if (data) {
            setFileExtension("." +  data);
          } else {
            setFileExtension('.txt');
          }
        })
        .catch((error) => {
          console.error('Ошибка при получении расширения файла:', error);
          setFileExtension('.txt');
        });
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
  
  // Преобразуем languages в формат, подходящий для react-select
  const options = languages.map((lang) => ({
    value: lang,
    label: lang,
  }));

  // Находим выбранную опцию
  const selectedOption = options.find((option) => option.value === language);
  

  return (
    <div className="window form">
      {/* Хедер */}
      <div className="info">
        {/* Выбор языка */}
        <Selector
          src={languages}
          elem={language}
          onChange={handleLanguageChange}
          text={"Language"}
        />
        {/* Кнопки копирования и скачивания */}
        <div>
          <button className="button download" onClick={handleDownloadFile}></button>
        </div>
      </div>
      {/* Редактор кода */}
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="myCustomColorfulTheme" // Указываем нашу пользовательскую яркую тему
          beforeMount={handleCodeMount} // Определяем тему перед монтированием редактора
          options={{ 
            selectOnLineNumbers: true,
            fontSize: 20
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
