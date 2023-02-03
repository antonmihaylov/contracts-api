/** @type {import('@eslint/eslintrc').Linter.Config} */
module.exports = {
  extends: ['antomic/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
  rules: {
    // Handled by TypeScript
    'import/no-unresolved': 'off',
    'no-undef': 'off',
    'node/no-unpublished-require': 'off',
  },
}
