import React, { useState } from 'react';
import SVGpart from './SVGpart';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/a11y-light.css';

import llvm from 'highlight.js/lib/languages/llvm';
import x86asm from 'highlight.js/lib/languages/x86asm';
import java from 'highlight.js/lib/languages/java';

hljs.registerLanguage('llvm', llvm);
hljs.registerLanguage('x86asm', x86asm);
hljs.registerLanguage('java', java);


const Representation = ({ title, content, onLineClick }) => {
  const [lineIndex, setLineIndex] = useState(null);
  const [selectedRepresentation, setSelectedRepresentation] = useState('LLVM IR');

  const handleRepresentationChange = (representation) => {
    setSelectedRepresentation(representation);
  };

  const handleLineClick = (index) => {
    console.log(`Нажата строка ${index + 1}`);
    setLineIndex(index);
    onLineClick(index);
  };

  // Определяем язык для подсветки синтаксиса в зависимости от выбранного представления
  let language;
  switch (selectedRepresentation) {
    case 'ASM':
      language = 'x86asm';
      break;
    case 'JAVA BYTECODE':
      language = 'java'; // Наиболее близкий вариант для байт-кода Java
      break;
    case 'LLVM IR':
      language = 'llvm';
      break;
    default:
      language = null;
  }

  return (
    <div className="window form">
      {/* Заголовок с выбором представления */}
      <div className="info">
        <label htmlFor="representation-select">Выберите представление:</label>
        <select
          id="representation-select"
          className="select-input"
          value={selectedRepresentation}
          onChange={(e) => handleRepresentationChange(e.target.value)}
        >
          <option value="ASM">ASM</option>
          <option value="JAVA BYTECODE">JAVA BYTECODE</option>
          <option value="LLVM IR">LLVM IR</option>
          <option value="SVG">SVG</option>
        </select>
      </div>

      {/* Блок для отображения содержимого */}
      {content ? (
        selectedRepresentation === 'SVG' ? (
          // Отображаем компонент для SVG
          <SVGpart svgContent={content} />
        ) : (
          // Отображаем текст с подсветкой синтаксиса
          <pre className="txt-win">
            {content.split('\n').map((line, index) => {
              // Подсвечиваем каждую строку отдельно
              const highlightedLine = hljs.highlight(line, { language }).value;
              return (
                <div
                  key={index}
                  onClick={() => handleLineClick(index)}
                  style={{ display: 'flex' }}
                  dangerouslySetInnerHTML={{
                    __html: <span class="line-number">${index + 1}</span>,
                  }}
                ></div>
              );
            })}
          </pre>
        )
      ) : (
        <p>Загрузите файл для отображения содержимого.</p>
      )}
    </div>
  );
};

export default Representation;
