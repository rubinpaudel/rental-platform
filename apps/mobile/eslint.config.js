import expoConfig from 'eslint-config-expo/flat.js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.expo/**',
      '**/dist/**',
      '**/.turbo/**',
      'metro.config.js',
      'babel.config.js',
      'tailwind.config.js',
    ],
  },
  ...expoConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];
