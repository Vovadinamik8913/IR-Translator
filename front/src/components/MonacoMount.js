import '@monaco-editor/react';
import { handleAsmMount } from '../modes/asm-mode';
import { handleJbcMount } from '../modes/jbc-mode';
import { handleLLVMIRMount } from '../modes/llvm-ir-mode';
import { handleDMount } from '../modes/d-mode';
import { handleCrystalMount } from '../modes/crystal-mode';
import { handleHaskellMount } from '../modes/haskell-mode';


export const handleRepresentationMount = (monaco) => {
    handleAsmMount(monaco);
    handleJbcMount(monaco);
    handleLLVMIRMount(monaco);
};

const defineTheme = (monaco) => {
    monaco.editor.defineTheme('myCustomColorfulTheme', {
      base: 'vs-dark',
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
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
      },
    });
};

export const handleCodeMount = (monaco) => {
    defineTheme(monaco);
    handleDMount(monaco);
    handleCrystalMount(monaco);
    handleHaskellMount(monaco);
};