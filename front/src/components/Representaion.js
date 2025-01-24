import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Selector from './Selector';
import '../styles/Code.css';
import {handleRepresentationMount} from './MonacoMount'
import FontSize from './FontSize';

const Representation = ({
  code,
  codeExtention,
  language,
  compilers,
  compiler, setCompiler,
  compilerFlags, setCompilerFlags,
  representation, setRepresentation,
  selectedRepresentation, setSelectedRepresentation
}) => {
  const [representations, setRepresentations] = useState([]);
  const [reprExtension, setReprExtension] = useState('');
  const [fontSize, setFontSize] = useState(14);


  useEffect(() => {
    if(compilers.length > 0) {
      setCompiler(compilers[0]);
    }
  }, [compilers])

  useEffect(() => {
    const getRepresentations = async () => {
      try {
        const buildFormData = new FormData();
        buildFormData.append('compiler', compiler);
        const response = await fetch('/lang/representation', {
          method: 'POST',
          body: buildFormData,
        });
        const data = await response.json();
        setRepresentations(data);
        //setRepresentation('');
        if (data.length > 0) {
          setSelectedRepresentation(data[0]);
        }
      } catch (error) {
        console.error('Ошибка при получении представлений:', error);
      }
    };

    getRepresentations();
  }, [compiler]);

  useEffect(() => {
    if (selectedRepresentation) {
      const fetchReprExtension = async () => {
        const buildFormData = new FormData();
        buildFormData.append('lang', selectedRepresentation);

        try {
          const response = await fetch('/lang/repr-extension', {
            method: 'POST',
            body: buildFormData,
          });
          const data = await response.text();
          if (data) {
            setReprExtension(data);
          } else {
            setReprExtension('.txt');
          }
        } catch (error) {
          console.error('Ошибка при получении расширения файла:', error);
          setReprExtension('.txt');
        }
      };

      fetchReprExtension();
    }
  }, [selectedRepresentation]);

  const handleRepresentationChange = (selectedOption) => {
      setSelectedRepresentation(selectedOption.value);
      setRepresentation('');
  };

   // Функция для удаления определенных строк
  const formatContent = (content) => {
    // Разбиваем содержимое на строки
    const lines = content.split('\n');
    console.log(lines);

    // Шаблоны для удаления
    const patternsToRemove = [
      /^;.*/,
      /^#.*/,
      /^\..*/,
      /^!.*/,                    // Удалить строки, начинающиеся с '!' и содержат '='
      /^source_filename.*/,         // Удалить строку с 'source_filename = '
      /^target .*/,                    // Удалить строки с 'target datalayout' и 'target triple'
      /^\.Lfunc_end.*/             // Удалить строки с '.Lfunc_end'
    ];

    // Фильтруем строки
    var filteredLines = lines.filter((line) => {
      // Проверяем, соответствует ли линия какому-либо шаблону
      for (const pattern of patternsToRemove) {
        if (pattern.test(line.trim())) {
          return false;
        }
      }
      return true;
    });
    const lastIndex = filteredLines.length - 1 - filteredLines.slice().reverse().findIndex(line => line.trim() !== '');

    filteredLines = filteredLines.filter((line, index) => {
      if(index === 0 && line.trim() === '') {
        return false;
      }
      if(index > lastIndex) {
        return false;
      }
      return true;
    })

    // Удаляем лишние пустые строки
    const formattedLines = filteredLines.join('\n').replace(/\n{2,}/g, '\n\n');

    return formattedLines;
  };
  
  const handleProcessCode = async () => {
      try {
        // Шаг 1: Формируем файл из текста кода
        const fileExtension = codeExtention || '.txt';
        var fileName = 'code' + fileExtension;
        if(language === "java") {
          fileName = getJavaClassName(code) + fileExtension;
        }
        console.log(fileName);
        const codeFile = new File([code], fileName, { type: 'text/plain' });
  
        // Шаг 2: Подготавливаем FormData
        const formData = new FormData();
        formData.append('language', language); // Предполагается, что расширение соответствует языку
        formData.append('compiler', compiler);
        formData.append('representation', selectedRepresentation);
        formData.append('flags', compilerFlags.split(" ")); // Если есть флаги компилятора
        formData.append('code', codeFile);
  
        // Шаг 3: Отправляем запрос на сервер
        const response = await fetch('/translate', {
          method: 'POST',
          body: formData,
        });
  
        // Шаг 4: Обрабатываем ответ
        if (response.ok) {
          const blob = await response.blob();
  
          // Отображаем содержимое файла
          const text = await blob.text();
          const formatted = formatContent(text);
          setRepresentation(formatted);
        } else {
          // Обработка ошибок
          console.error('Ошибка при обработке кода на сервере');
        }
      } catch (error) {
        console.error('Ошибка при обработке кода:', error);
      }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([representation], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `repr${reprExtension}`;
    link.click();
  };

  const handleCompilerChange = (selectedOption) => {
    setCompiler(selectedOption.value);
    setRepresentation('')
  };

  const handleCompilerFlagsChange = (event) => {
    setCompilerFlags(event.target.value);
  };
  
  const getJavaClassName = (code) => {
    // Ищем первое вхождение слова "class"
    // и захватываем слово (состоящее из букв, цифр и _) после него.
    const pattern = /class +([A-Za-z0-9_]+)/;
    const match = code.match(pattern);
    return match ? match[1] : null;
  }
  

  return (
    <div className="window form">
      {/* Выбор представления */}
      <div className="info">
        <div className="margin-right-15">
          <button className="button run" onClick={handleProcessCode}></button>
        </div>
        <FontSize
          setFontSize={setFontSize}
        />
        {/* Выбор компилятора */}
        <Selector
          src={compilers}
          elem={compiler}
          onChange={handleCompilerChange}
          text={"Compiler"}
        />
        {/* Ввод ключей для компилятора */}
        <div className="flex-grow">
          <input
            id="compiler-flags"
            type="text"
            value={compilerFlags}
            onChange={handleCompilerFlagsChange}
            className="text-input"
          />
        </div>
        <Selector
          src={representations}
          elem={selectedRepresentation}
          onChange={handleRepresentationChange}
          text={"Representation"}
        />
        {/* Кнопки копирования и скачивания */}
        <div className="margin-right-15">
          <button className="button download" onClick={handleDownloadFile}></button>
        </div>
      </div>


      <Editor
        height="100%"
        theme="vs-dark"
        language={selectedRepresentation}
        value={representation}
        options={{
          fontSize: fontSize,
          readOnly: true,
        }}
        beforeMount={handleRepresentationMount}
      />
    </div>
  );
};

export default Representation;
