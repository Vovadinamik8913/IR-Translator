import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Selector from './Selector';
import '../styles/Representation.css';
import {handleRepresentationMount} from './MonacoMount'

const Representation = ({
  code,
  codeExtention,
  language,
  compilers
}) => {
  const [selectedRepresentation, setSelectedRepresentation] = useState('');
  const [representation, setRepresentation] = useState('');
  const [compilerFlags, setCompilerFlags] = useState('');
  const [compiler, setCompiler] = useState('');
  const [representations, setRepresentations] = useState([]);
  const [reprExtension, setReprExtension] = useState('');
  const [downloadLink, setDownloadLink] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState('output.txt');


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
        setRepresentation('');
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
        buildFormData.append('representation', selectedRepresentation);

        try {
          const response = await fetch('/lang/repr-extension', {
            method: 'POST',
            body: buildFormData,
          });
          const data = await response.text();
          if (data) {
            setReprExtension('.' + data);
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
  
    const handleProcessCode = async () => {
      try {
        // Шаг 1: Формируем файл из текста кода
        const fileExtension = codeExtention || '.txt';
        const fileName = 'code' + fileExtension;
        const codeFile = new File([code], fileName, { type: 'text/plain' });
  
        // Шаг 2: Подготавливаем FormData
        const formData = new FormData();
        //formData.append('user', null); 
        //formData.append('project', null); 
        formData.append('language', language); // Предполагается, что расширение соответствует языку
        formData.append('compiler', compiler);
        formData.append('representation', selectedRepresentation);
        formData.append('flags', compilerFlags); // Если есть флаги компилятора
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
          setRepresentation(text);
  
          // Создаем URL для скачивания файла
          const url = URL.createObjectURL(blob);
          setDownloadLink(url);
          setDownloadFileName('output' + reprExtension);
        } else {
          // Обработка ошибок
          console.error('Ошибка при обработке кода на сервере');
        }
      } catch (error) {
        console.error('Ошибка при обработке кода:', error);
      }
    };


  const handleDownloadFile = () => {
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = downloadFileName;
    link.click();
  };


  const handleCompilerChange = (selectedOption) => {
    setCompiler(selectedOption.value);
    setRepresentation('')
  };

  const handleCompilerFlagsChange = (event) => {
    setCompilerFlags(event.target.value);
  };
  

  return (
    <div className="window form">
      {/* Выбор представления */}
      <div className="info">
        <div className="margin-right-15">
          <button className="button run" onClick={handleProcessCode}></button>
        </div>

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
          fontSize: 20,
          readOnly: true,
        }}
        beforeMount={handleRepresentationMount}
      />
    </div>
  );
};

export default Representation;
