import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.extends('prettier'), // Add prettier config
  {
    ignores: [
      'src/generated/**/*',
      '*.generated.*',
      'node_modules/**/*',
      '.next/**/*',
      'out/**/*',
      'build/**/*',
      'dist/**/*',
      '**/*.test.*',
      '**/*.spec.*',
      '**/test-*.ts',
      '**/test-*.tsx',
      '**/test-*.js',
      '**/test-*.jsx',
    ],
  },
  {
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',

      // React specific rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off', // Using TypeScript instead

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Configuration for test files
  {
    files: ['**/test-*.ts', '**/test-*.tsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      'no-console': 'off', // Allow console.log in test files
    },
  },
  // Configuration for seed and utility files
  {
    files: ['**/seed.ts', '**/scripts/**/*.js', '**/scripts/**/*.ts'],
    rules: {
      'no-console': 'off', // Allow console.log in seed and script files
      '@typescript-eslint/no-require-imports': 'off', // Allow require() in scripts
    },
  },
];

export default eslintConfig;
