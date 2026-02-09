import neostandard from 'neostandard';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.temp/**',
      '**/tsp-output/**',
      '**/test/fixtures/tsp-output/**',
      '**/test/e2e/generated/**',
      '**/examples/**',
      '**/temp/**',
      '**/eng/scripts/**',
    ],
  },
  ...neostandard({
    ts: true,
  }),
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/jsx-key': 'off',
    },
  },
];
