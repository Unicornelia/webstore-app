import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.es2025 } },
  {
    plugins: {
      eslintPluginPrettier,
      pluginJs,
    },
  },
];
