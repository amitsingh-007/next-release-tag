import { type FlatXoConfig } from 'xo';

const xoConfig: FlatXoConfig = [
  {
    prettier: true,
    space: true,
  },
  {
    rules: {
      'import-x/extensions': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-restricted-types': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },
];

export default xoConfig;
