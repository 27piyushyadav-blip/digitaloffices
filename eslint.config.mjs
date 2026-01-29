import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import path from 'path';
import tsEslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

// 1. DEFINE YOUR PROJECT PATHS HERE
// Use globs to target your specific apps/packages
const PROJECT_PATHS = {
  nextJs: ['apps/web/**/*.{js,jsx,ts,tsx}', 'packages/ui/**/*.{js,jsx,ts,tsx}'],
  nestJs: ['apps/api/**/*.ts', 'apps/worker/**/*.ts'],
  nodeJs: ['packages/scripts/**/*.ts'], // Generic Node scripts
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compatibility utility to load "legacy" configs (like Next.js / NestJS defaults)
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tsEslint.config(
  // ========================================================
  // 1. GLOBAL IGNORES
  // ========================================================
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.nest/**',
    ],
  },

  // ========================================================
  // 2. BASE JAVASCRIPT & TYPESCRIPT RULES (Applies to ALL)
  // ========================================================
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      // Common custom rules for the whole monorepo
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // ========================================================
  // 3. NEXT.JS SPECIFIC CONFIGURATION
  // ========================================================
  ...compat.extends('next/core-web-vitals').map((config) => ({
    ...config,
    files: PROJECT_PATHS.nextJs, // Only apply Next.js rules to Next.js projects
  })),
  {
    files: PROJECT_PATHS.nextJs,
    rules: {
      // Next.js specific overrides if needed
      '@next/next/no-html-link-for-pages': 'off',
    },
  },

  // ========================================================
  // 4. NESTJS SPECIFIC CONFIGURATION
  // ========================================================
  // NestJS often disables certain strict TS rules for DX
  {
    files: PROJECT_PATHS.nestJs,
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // NestJS uses 'any' often
    },
  },

  // ========================================================
  // 5. PRETTIER (MUST BE LAST)
  // ========================================================
  // Disables all ESLint rules that might conflict with Prettier
  eslintConfigPrettier,
);
