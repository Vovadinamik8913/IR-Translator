import '@monaco-editor/react';

export const handleRepresentationMount = (monaco) => {
    monaco.languages.register({ id: 'ASM' });

    // Определение токенов и правил подсветки синтаксиса
    monaco.languages.setMonarchTokensProvider('ASM', {
        defaultToken: 'invalid',

        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        registers: /%?\b(r[0-9]+[dbw]?|([er]?([abcd][xhl]|cs|fs|ds|ss|sp|bp|ip|sil?|dil?))|[xyz]mm[0-9]+|sp|fp|lr)\b/,

        intelOperators: /PTR|(D|Q|[XYZ]MM)?WORD/,

        tokenizer: {
            root: [
                // Error document
                [/^<.*>$/, {token: 'annotation'}],
                // inline comments
                [/\/\*/, 'comment', '@comment'],
                // Label definition
                [/^[.a-zA-Z0-9_$?@].*:/, {token: 'type.identifier'}],
                // Label definition (quoted)
                [/^"([^"\\]|\\.)*":/, {token: 'type.identifier'}],
                // Label definition (ARM style)
                [/^\s*[|][^|]*[|]/, {token: 'type.identifier'}],
                // Label definition (CL style)
                [/^\s*[.a-zA-Z0-9_$|]*\s+(PROC|ENDP|DB|DD)/, {token: 'type.identifier', next: '@rest'}],
                // Constant definition
                [/^[.a-zA-Z0-9_$?@][^=]*=/, {token: 'type.identifier'}],
                // opcode
                [/[.a-zA-Z_][.a-zA-Z_0-9]*/, {token: 'keyword', next: '@rest'}],
                // braces and parentheses at the start of the line (e.g. nvcc output)
                [/[(){}]/, {token: 'operator', next: '@rest'}],
                // msvc can have strings at the start of a line in a inSegDirList
                [/`/, {token: 'string.backtick', bracket: '@open', next: '@segDirMsvcstring'}],

                // whitespace
                {include: '@whitespace'},
            ],

            rest: [
                // pop at the beginning of the next line and rematch
                [/^.*$/, {token: '@rematch', next: '@pop'}],

                [/@registers/, 'variable.predefined'],
                [/@intelOperators/, 'annotation'],
                // inline comments
                [/\/\*/, 'comment', '@comment'],

                // brackets
                [/[{}<>()[\]]/, '@brackets'],

                // ARM-style label reference
                [/[|][^|]*[|]*/, 'type.identifier'],

                // numbers
                [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
                [/([$]|0[xX])[0-9a-fA-F]+/, 'number.hex'],
                [/\d+/, 'number'],
                // ARM-style immediate numbers (which otherwise look like comments)
                [/#-?\d+/, 'number'],

                // operators
                [/[-+,*/!:&{}()]/, 'operator'],

                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
                [/"/, {token: 'string.quote', bracket: '@open', next: '@string'}],
                // `msvc does this, sometimes'
                [/`/, {token: 'string.backtick', bracket: '@open', next: '@msvcstring'}],
                [/'/, {token: 'string.singlequote', bracket: '@open', next: '@sstring'}],

                // characters
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid'],

                // Assume anything else is a label reference. .NET uses ` in some identifiers
                [/%?[.?_$a-zA-Z@][.?_$a-zA-Z0-9@`]*/, 'type.identifier'],

                // whitespace
                {include: '@whitespace'},
            ],

            comment: [
                [/[^/*]+/, 'comment'],
                [/\/\*/, 'comment', '@push'], // nested comment
                ['\\*/', 'comment', '@pop'],
                [/[/*]/, 'comment'],
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, {token: 'string.quote', bracket: '@close', next: '@pop'}],
            ],

            msvcstringCommon: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/''/, 'string.escape'], // ` isn't escaped but ' is escaped as ''
                [/\\./, 'string.escape.invalid'],
            ],

            msvcstring: [
                {include: '@msvcstringCommon'},
                [/'/, {token: 'string.backtick', bracket: '@close', next: '@pop'}],
            ],

            segDirMsvcstring: [
                {include: '@msvcstringCommon'},
                [/'/, {token: 'string.backtick', bracket: '@close', switchTo: '@rest'}],
            ],

            sstring: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'/, {token: 'string.singlequote', bracket: '@close', next: '@pop'}],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
                [/[#;\\@].*$/, 'comment'],
            ],
        },
    });

    monaco.languages.register({ id: 'LLVM IR' });

    // Определение токенов и правил подсветки синтаксиса
    monaco.languages.setMonarchTokensProvider('LLVM IR', {
      types: [
        'void',
        'half',
        'float',
        'double',
        'x86_fp80',
        'fp128',
        'ppc_fp128',
        'label',
        'metadata',
        'x86_mmx',
        'type',
        'label',
        'opaque',
        'token',
        'ptr',
    ],
    // llvmStatement
    statements: [
        'add',
        'addrspacecast',
        'alloca',
        'and',
        'arcp',
        'ashr',
        'atomicrmw',
        'bitcast',
        'br',
        'catchpad',
        'catchswitch',
        'catchret',
        'call',
        'cleanuppad',
        'cleanupret',
        'cmpxchg',
        'eq',
        'exact',
        'extractelement',
        'extractvalue',
        'fadd',
        'fast',
        'fcmp',
        'fdiv',
        'fence',
        'fmul',
        'fpext',
        'fptosi',
        'fptoui',
        'fptrunc',
        'free',
        'frem',
        'fsub',
        'getelementptr',
        'icmp',
        'inbounds',
        'indirectbr',
        'insertelement',
        'insertvalue',
        'inttoptr',
        'invoke',
        'landingpad',
        'load',
        'lshr',
        'malloc',
        'max',
        'min',
        'mul',
        'nand',
        'ne',
        'ninf',
        'nnan',
        'nsw',
        'nsz',
        'nuw',
        'oeq',
        'oge',
        'ogt',
        'ole',
        'olt',
        'one',
        'or',
        'ord',
        'phi',
        'ptrtoint',
        'resume',
        'ret',
        'sdiv',
        'select',
        'sext',
        'sge',
        'sgt',
        'shl',
        'shufflevector',
        'sitofp',
        'sle',
        'slt',
        'srem',
        'store',
        'sub',
        'switch',
        'trunc',
        'udiv',
        'ueq',
        'uge',
        'ugt',
        'uitofp',
        'ule',
        'ult',
        'umax',
        'umin',
        'une',
        'uno',
        'unreachable',
        'unwind',
        'urem',
        'va_arg',
        'xchg',
        'xor',
        'zext',
    ],
    // llvmKeyword
    keywords: [
        'acq_rel',
        'acquire',
        'addrspace',
        'alias',
        'align',
        'alignstack',
        'allocalign',
        'allocptr',
        'alwaysinline',
        'appending',
        'argmemonly',
        'arm_aapcscc',
        'arm_aapcs_vfpcc',
        'arm_apcscc',
        'asm',
        'atomic',
        'available_externally',
        'blockaddress',
        'builtin',
        'byref',
        'byval',
        'c',
        'catch',
        'caller',
        'cc',
        'ccc',
        'cleanup',
        'coldcc',
        'comdat',
        'common',
        'constant',
        'datalayout',
        'dead_on_unwind',
        'declare',
        'default',
        'define',
        'deplibs',
        'dereferenceable',
        'dereferenceable_or_null',
        'distinct',
        'dllexport',
        'dllimport',
        'dso_local',
        'dso_preemptable',
        'elementtype',
        'except',
        'external',
        'externally_initialized',
        'extern_weak',
        'fastcc',
        'filter',
        'from',
        'gc',
        'global',
        'hhvmcc',
        'hhvm_ccc',
        'hidden',
        'immarg',
        'inalloca',
        'initialexec',
        'inlinehint',
        'inreg',
        'inteldialect',
        'intel_ocl_bicc',
        'internal',
        'linkonce',
        'linkonce_odr',
        'localdynamic',
        'localexec',
        'local_unnamed_addr',
        'minsize',
        'module',
        'monotonic',
        'msp430_intrcc',
        'musttail',
        'naked',
        'nest',
        'noalias',
        'nobuiltin',
        'nocapture',
        'nofree',
        'nofpclass',
        'noimplicitfloat',
        'noinline',
        'nonlazybind',
        'nonnull',
        'norecurse',
        'noredzone',
        'noreturn',
        'noundef',
        'nounwind',
        'optnone',
        'optsize',
        'personality',
        'preallocated',
        'private',
        'protected',
        'ptx_device',
        'ptx_kernel',
        'readnone',
        'readonly',
        'release',
        'returned',
        'returns_twice',
        'sanitize_address',
        'sanitize_memory',
        'sanitize_thread',
        'section',
        'seq_cst',
        'sideeffect',
        'signext',
        'syncscope',
        'source_filename',
        'speculatable',
        'spir_func',
        'spir_kernel',
        'sret',
        'ssp',
        'sspreq',
        'sspstrong',
        'strictfp',
        'swiftasync',
        'swiftcc',
        'swifterror',
        'swiftself',
        'tail',
        'target',
        'thread_local',
        'to',
        'triple',
        'unnamed_addr',
        'unordered',
        'uselistorder',
        'uselistorder_bb',
        'uwtable',
        'volatile',
        'weak',
        'weak_odr',
        'within',
        'writable',
        'writeonly',
        'x86_64_sysvcc',
        'win64cc',
        'x86_fastcallcc',
        'x86_stdcallcc',
        'x86_thiscallcc',
        'zeroext',
    ],

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
        root: [
            [/[,(){}<>[\]]/, 'delimiters'],
            [/i\d+\**/, 'type'], // llvmType

            // Misc syntax.
            [/[%@!]\d+/, 'variable.name'], // llvmNoName
            [/-?\d+\.\d*(e[+-]\d+)?/, 'number.float'], // llvmFloat
            [/0[xX][0-9A-Fa-f]+/, 'number.hex'], // llvmFloat
            [/-?\d+/, 'number'], // llvmNumber
            [/\b(true|false)\b/, 'keyword'], // llvmBoolean
            [/\b(zeroinitializer|undef|null|none)\b/, 'constant'], // llvmConstant
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
            [/"/, 'string', '@string'], // push to string state
            // slightly modified to support demangled function signatures as labels for llvm ir control flow graphs
            [/[-a-zA-Z$._][-a-zA-Z$._0-9]*(?:\([^:]+\))?:/, 'tag'], // llvmLabel
            [/[%@][-a-zA-Z$._][-a-zA-Z$._0-9]*/, 'variable.name'], // llvmIdentifier

            // Named metadata and specialized metadata keywords.
            [/![-a-zA-Z$._][-a-zA-Z$._0-9]*(?=\s*)$/, 'identifier'], // llvmIdentifier
            [/![-a-zA-Z$._][-a-zA-Z$._0-9]*(?=\s*[=!])/, 'identifier'], // llvmIdentifier
            [/![A-Za-z]+(?=\s*\()/, 'type'], // llvmType
            [/\bDW_TAG_[a-z_]+\b/, 'constant'], // llvmConstant
            [/\bDW_ATE_[a-zA-Z_]+\b/, 'constant'], // llvmConstant
            [/\bDW_OP_[a-zA-Z0-9_]+\b/, 'constant'], // llvmConstant
            [/\bDW_LANG_[a-zA-Z0-9_]+\b/, 'constant'], // llvmConstant
            [/\bDW_VIRTUALITY_[a-z_]+\b/, 'constant'], // llvmConstant
            [/\bDIFlag[A-Za-z]+\b/, 'constant'], // llvmConstant

            // Syntax-highlight lit test commands and bug numbers.
            [/;\s*PR\d*\s*$/, 'comment.doc'], // llvmSpecialComment
            [/;\s*REQUIRES:.*$/, 'comment.doc'], // llvmSpecialComment
            [/;\s*RUN:.*$/, 'comment.doc'], // llvmSpecialComment
            [/;\s*CHECK:.*$/, 'comment.doc'], // llvmSpecialComment
            [/;\s*CHECK-(?:NEXT|NOT|DAG|SAME|LABEL):.*$/, 'comment.doc'], // llvmSpecialComment
            [/;\s*XFAIL:.*$/, 'comment.doc'], // llvmSpecialComment
            [/;.*$/, 'comment'],
            [/[*#=!]/, 'operators'],
            [
                /[a-z_$][\w$]*/,
                {
                    cases: {
                        '@statements': 'operators',
                        '@keywords': 'keyword',
                        '@types': 'type',
                        '@default': 'identifier',
                    },
                },
            ],
            [/[ \t\r\n]+/, 'white'],
        ],
        string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop'],
        ],
    },
    });
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

export const handleCodeMount = (monaco) => {
    defineTheme(monaco);
    monaco.languages.register({id: 'd'});
    monaco.languages.setMonarchTokensProvider('d', {
        defaultToken: 'invalid',

        keywords: [
            'abstract',
            'alias',
            'align',
            'asm',
            'assert',
            'auto',
            'body',
            'bool',
            'break',
            'byte',
            'case',
            'cast',
            'catch',
            'cdouble',
            'cent',
            'cfloat',
            'char',
            'class',
            'const',
            'continue',
            'creal',
            'dchar',
            'debug',
            'default',
            'delegate',
            'delete ',
            'deprecated',
            'do',
            'double',
            'else',
            'enum',
            'export',
            'extern',
            'false',
            'final',
            'finally',
            'float',
            'for',
            'foreach',
            'foreach_reverse',
            'function',
            'goto',
            'idouble',
            'if',
            'ifloat',
            'immutable',
            'import',
            'in',
            'inout',
            'int',
            'interface',
            'invariant',
            'ireal',
            'is',
            'lazy',
            'long',
            'macro',
            'mixin',
            'module',
            'new',
            'nothrow',
            'null',
            'out',
            'override',
            'package',
            'pragma',
            'private',
            'protected',
            'public',
            'pure',
            'real',
            'ref',
            'return',
            'scope',
            'shared',
            'short',
            'static',
            'struct',
            'super',
            'switch',
            'synchronized',
            'template',
            'this',
            'throw',
            'true',
            'try',
            'typedef',
            'typeid',
            'typeof',
            'ubyte',
            'ucent',
            'uint',
            'ulong',
            'union',
            'unittest',
            'ushort',
            'version',
            'void',
            'volatile',
            'wchar',
            'while',
            'with',
            '__FILE__',
            '__FILE_FULL_PATH__',
            '__MODULE__',
            '__LINE__',
            '__FUNCTION__',
            '__PRETTY_FUNCTION__',
            '__gshared',
            '__traits',
            '__vector',
            '__parameters',
        ],

        typeKeywords: [
            'bool',
            'byte',
            'ubyte',
            'short',
            'ushort',
            'int',
            'uint',
            'long',
            'ulong',
            'char',
            'wchar',
            'dchar',
            'float',
            'double',
            'real',
            'ifloat',
            'idouble',
            'ireal',
            'cfloat',
            'cdouble',
            'creal',
            'void',
        ],

        operators: [
            '=',
            '>',
            '<',
            '!',
            '~',
            '?',
            ':',
            '==',
            '<=',
            '>=',
            '!=',
            '&&',
            '||',
            '++',
            '--',
            '+',
            '-',
            '*',
            '/',
            '&',
            '|',
            '^',
            '%',
            '<<',
            '>>',
            '>>>',
            '+=',
            '-=',
            '*=',
            '/=',
            '&=',
            '|=',
            '^=',
            '%=',
            '<<=',
            '>>=',
            '>>>=',
        ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*/^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        // The main tokenizer for our languages
        tokenizer: {
            root: [
                // identifiers and keywords
                [
                    /[a-z_$][\w$]*/,
                    {
                        cases: {
                            '@typeKeywords': 'keyword',
                            '@keywords': 'keyword',
                            '@default': 'identifier',
                        },
                    },
                ],
                [/[A-Z][\w$]*/, 'type.identifier'], // to show class names nicely

                // whitespace
                {include: '@whitespace'},

                // delimiters and operators
                [/[{}()[\]]/, '@brackets'],
                [/[<>](?!@symbols)/, '@brackets'],
                [
                    /@symbols/,
                    {
                        cases: {
                            '@operators': 'operator',
                            '@default': '',
                        },
                    },
                ],

                // numbers
                [/\d*\.\d+([eE][-+]?\d+)?[fFdD]?/, 'number.float'],
                [/0[xX][0-9a-fA-F_]*[0-9a-fA-F][Ll]?/, 'number.hex'],
                [/0[0-7_]*[0-7][Ll]?/, 'number.octal'],
                [/0[bB][0-1_]*[0-1][Ll]?/, 'number.binary'],
                [/\d+[lL]?/, 'number'],

                // delimiter: after number because of .\d floats
                [/[;,.]/, 'delimiter'],

                // strings
                [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
                [/"/, 'string', '@string'],
                [/`/, 'string', '@rawstring'],

                // characters
                [/'[^\\']'/, 'string'],
                [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                [/'/, 'string.invalid'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\+/, 'comment', '@nestingcomment'],
                [/\/\/.*$/, 'comment'],
            ],

            comment: [
                [/[^/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[/*]/, 'comment'],
            ],

            nestingcomment: [
                [/[^/+]+/, 'comment'],
                [/\/\+/, 'comment', '@push'],
                [/\/\+/, 'comment.invalid'],
                [/\+\//, 'comment', '@pop'],
                [/[/+]/, 'comment'],
            ],

            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, 'string', '@pop'],
            ],

            rawstring: [
                [/[^`]/, 'string'],
                [/`/, 'string', '@pop'],
            ],
        }
    });

    monaco.languages.register({id: 'haskell'});
    monaco.languages.setMonarchTokensProvider('haskell', {
        keywords: [
            'module',
            'import',
            'main',
            'where',
            'otherwise',
            'newtype',
            'definition',
            'implementation',
            'from',
            'class',
            'instance',
            'abort',
        ],

        builtintypes: ['Int', 'Real', 'String'],

        operators: ['=', '==', '>=', '<=', '+', '-', '*', '/', '::', '->', '=:', '=>', '|', '$'],

        numbers: /-?[0-9.]/,

        tokenizer: {
            root: [
                {include: '@whitespace'},

                [/->/, 'operators'],

                [/\|/, 'operators'],

                [/(\w*)(\s?)(::)/, ['keyword', 'white', 'operators']],

                [/[+\-*/=<>$]/, 'operators'],

                [
                    /[a-zA-Z_][a-zA-Z0-9_]*/,
                    {
                        cases: {
                            '@builtintypes': 'type',
                            '@keywords': 'keyword',
                            '@default': '',
                        },
                    },
                ],

                [/[()[\],:]/, 'delimiter'],

                [/@numbers/, 'number'],

                [/(")(.*)(")/, ['string', 'string', 'string']],
            ],

            comment: [
                [/[^/*]+/, 'comment'],
                [/\*\//, 'comment', '@pop'],
                [/[/*]/, 'comment'],
            ],

            whitespace: [
                [/[ \t\r\n]+/, 'white'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
                [/--.*$/, 'comment'],
            ],
        }
    });
};
