// @ts-check
import eslint from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';


export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    ignores: ['eslint.config.mjs'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      // @ts-ignore
      'import-x': importX,
      'sort-keys-fix': sortKeysFix,
      // @ts-ignore
      'typescript-sort-keys': typescriptSortKeys,
    },
    extends: [
      'import-x/flat/typescript',
    ],
    settings: {
      'import-x/resolver': {
        typescript: {
          project: '.',
        },
      },
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': ["error", "asc", {"caseSensitive": true, "natural": false}],
      'typescript-sort-keys/interface': ["error", "asc", {caseSensitive: true, natural: false, requiredFirst: true}],
      'typescript-sort-keys/string-enum': ["error", "asc", {caseSensitive: true, natural: false}],
      'simple-import-sort/imports': [
        'error', 
        {
          "groups": [
            // 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
            ["^\\u0000"],
            // 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ["^react$", "^@?\\w"],
            // 3. Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group. (also relative imports starting with "../")
            ["^@", "^"],
            // 4. For type imports
            ["^type:"],
            // 5. style module imports always come last, this helps to avoid CSS order issues
            ["^.+\\.(module.css|module.scss)$"],
            // 6. media imports
            ["^.+\\.(gif|png|svg|jpg)$"]
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        }
      ],
    },
  },
  {
    // update this to match your test files
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
