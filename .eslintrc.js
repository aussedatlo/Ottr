module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    'react-native',
    'react-hooks',
    '@typescript-eslint',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react-native/no-unused-styles': 2,
    // "react-native/split-platform-components": 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    // "react-native/no-raw-text": 2,
    'react-native/no-single-element-style-arrays': 2,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
