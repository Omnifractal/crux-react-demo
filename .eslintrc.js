const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  plugins: [
    'react',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'google',
  ],
  rules: {
    'curly': [ERROR, 'multi-line'],
    'quotes': [ERROR, 'single'],
    'no-eval': [ERROR],
    'no-new-wrappers': [ERROR],
    'no-var': [ERROR],
    'no-redeclare': [OFF],
    'prefer-const': [WARN],
    'eqeqeq': [ERROR, 'smart'],
    'object-curly-spacing': [ERROR, 'always'],
    'space-infix-ops': [ERROR],
    'comma-dangle': [ERROR, 'always-multiline'],
    'semi': [ERROR, 'always'],
    'no-multi-spaces': [ERROR],
    'indent': [ERROR, 2, { 'SwitchCase': 1 }],
    'require-jsdoc': [OFF],
    'max-len': [OFF],
    'space-before-blocks': [ERROR, 'always'],
    'react/jsx-key': [ERROR],
    'react/jsx-no-bind': [OFF],
    'react/no-string-refs': [ERROR],
    'react/jsx-uses-vars': [ERROR],
    'react/jsx-uses-react': [ERROR],
    'react/no-unused-state': [ERROR],
    'react/prop-types': [OFF],
    'react/react-in-jsx-scope': [OFF],
    'react/no-unused-prop-types': [WARN],
    'react-hooks/exhaustive-deps': [OFF],
  },
};
