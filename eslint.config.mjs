import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '*.generated.*',
      '*.d.ts',
      'next-env.d.ts',
      'prisma/migrations/**',
      '.taskmaster/**',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      '*.db',
      '*.sqlite',
      'public/**',
      '.git/**',
      '.vscode/**',
      '.github/**',
      'scripts/**',
      '*.config.*',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
];

export default eslintConfig;
