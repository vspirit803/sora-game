/*
 * @Author: vspirit803
 * @Date: 2021-03-08 09:59:13
 * @Description:
 * @LastEditTime: 2021-03-10 17:37:27
 * @LastEditors: vspirit803
 */
module.exports = {
  parser: 'vue-eslint-parser',
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['simple-import-sort', 'import'],
  extends: [
    // add more generic rulesets here, such as:
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:import/typescript',
    'prettier',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    // 'block-spacing': 'off',
    'spaced-comment': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-useless-constructor': 'off',
    'no-unused-labels': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    // 'no-eval': 'off',
    // 'computed-property-even-spacing': 'off',
    // 'standard/computed-property-even-spacing': 'off'
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',

    'vue/attributes-order': 'error',
    // 'vue/valid-v-slot': [
    //   'error',
    //   {
    //     allowModifiers: true,
    //   },
    // ],
    'vue/no-unused-vars': 'warn',
    'vue/no-mutating-props': 'off',
    'vue/custom-event-name-casing': 'off',
  },
};
