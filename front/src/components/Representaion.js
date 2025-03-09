import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Selector from './Selector';
import '../styles/Code.css';
import {handleRepresentationMount} from './MonacoMount'
import FontSize from './FontSize';
import { getRepresentationExtension, getRepresentationsLanguages } from '../api/lang-api';
import { translate } from '../api/translate-api';

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
        const data = await getRepresentationsLanguages(compiler);
        setRepresentations(data);
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
        try {
          const data = await getRepresentationExtension(selectedRepresentation);
          setReprExtension(data);
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

  const formatContent = (content) => {
    const lines = content.split('\n');
    console.log(lines);

    const patternsToRemove = [
      /^;.*/,
      /^#.*/,
      /^\..*/,
      /^!.*/,                    
      /^source_filename.*/,         
      /^target .*/,                    
      /^\.Lfunc_end.*/             
    ];

    var filteredLines = lines.filter((line) => {
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
        const fileExtension = codeExtention || '.txt';
        var fileName = 'code' + fileExtension;
        if(language === "java") {
          fileName = getJavaClassName(code) + fileExtension;
        }
        console.log(fileName);
        const codeFile = new File([code], fileName, { type: 'text/plain' });
  
        const formData = new FormData();
        formData.append('language', language);
        formData.append('compiler', compiler);
        formData.append('representation', selectedRepresentation);
        formData.append('flags', compilerFlags.split(" "));
        formData.append('code', codeFile);
        
        const text = await translate(formData);
        const formatted = formatContent(text);
        setRepresentation(formatted);
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
    const pattern = /class +([A-Za-z0-9_]+)/;
    const match = code.match(pattern);
    return match ? match[1] : null;
  }
  

  return (
    <div className="window form">
      <div className="info">
        <div className="margin-right-15">
          <button className="button run" onClick={handleProcessCode}></button>
        </div>
        <FontSize
          setFontSize={setFontSize}
        />
        <Selector
          src={compilers}
          elem={compiler}
          onChange={handleCompilerChange}
          text={"Compiler"}
        />
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
