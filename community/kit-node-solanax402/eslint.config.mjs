import parser from '@typescript-eslint/parser';
import js from '@eslint/js';
import plugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser, parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
    plugins: { '@typescript-eslint': plugin },
    rules: {
      ...js.configs.recommended.rules,
      ...plugin.configs.recommended.rules,
      'no-undef': 'off', // TypeScript checks unresolved names, including Node globals.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];
