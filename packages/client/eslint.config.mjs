import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import sortImportRequires from 'eslint-plugin-sort-imports-requires';
import prettier from 'eslint-config-prettier';

// Удаляем ключ с пробелом
const filteredGlobals = Object.fromEntries(
  Object.entries({
    ...globals.browser,
    ...globals.es2021
  }).filter(([key]) => key.trim() === key) // удаляет ключи с пробелами
);

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: filteredGlobals
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'sort-imports-requires': sortImportRequires
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'no-console': 'off',
      'sort-imports-requires/sort-imports': ['error', { unsafeAutofix: true }],
      'sort-imports-requires/sort-requires': ['error', { unsafeAutofix: true }]
    }
  },
  prettier
];
