import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

const languages = [
  'python',
  'cpp',
  'java',
  'csharp',
  'go',
  'ruby',
  'swift',
]; // Список из 10 поддерживаемых Monaco языков

// Сопоставление языков с компиляторами
const compilersByLanguage = {
  python: ['CPython', 'PyPy'],
  cpp: ['GCC', 'Clang', 'MSVC'],
  java: ['Javac', 'ECJ'],
  csharp: ['CSC', '.NET'],
  go: ['gc', 'gccgo'],
  ruby: ['Ruby'],
  swift: ['Swiftc']
};

const CodeEditor = ({ title }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [compiler, setCompiler] = useState('');
  const [compilerFlags, setCompilerFlags] = useState('');

  // Обновляем список компиляторов при смене языка
  useEffect(() => {
    const compilers = compilersByLanguage[language];
    setCompiler(compilers ? compilers[0] : '');
  }, [language]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCompilerChange = (event) => {
    setCompiler(event.target.value);
  };

  const handleCompilerFlagsChange = (event) => {
    setCompilerFlags(event.target.value);
  };

  // Функция для определения пользовательской яркой темы
  const defineTheme = (monaco) => {
    monaco.editor.defineTheme('myCustomColorfulTheme', {
      base: 'vs-dark', // Используем темную базовую тему
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'regexp', foreground: 'D16969' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'namespace', foreground: '4EC9B0' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'class', foreground: '4EC9B0' },
        { token: 'interface', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        // Добавьте другие правила для нужных токенов
      ],
      colors: {
        'editor.background': '#1E1E1E', // Цвет фона редактора
        'editor.foreground': '#D4D4D4',
        // Добавьте другие цвета, если необходимо
      },
    });
  };

  const handleEditorWillMount = (monaco) => {
    defineTheme(monaco);
  };

  return (
    <div className="window form">
      {/* Хедер */}
      <div className="info">
        {/* Выбор языка */}
        <div className="margin-right-15">
          <select
            id="language-select"
            onChange={handleLanguageChange}
            value={language}
            className="select-input"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        {/* Выбор компилятора */}
        <div className="margin-right-15">
          <select
            id="compiler-select"
            onChange={handleCompilerChange}
            value={compiler}
            className="select-input"
          >
            {compilersByLanguage[language]?.map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        </div>
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
      </div>
      {/* Редактор кода */}
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="myCustomColorfulTheme" // Указываем нашу пользовательскую яркую тему
          beforeMount={handleEditorWillMount} // Определяем тему перед монтированием редактора
          options={{ selectOnLineNumbers: true, }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
