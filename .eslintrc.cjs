module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    module: 'readonly'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // 相当于 {"extends": ["prettier"],"plugins": ["prettier"],"rules": {"prettier/prettier": "error","arrow-body-style": "off","prefer-arrow-callback": "off"}},详见：`https://github.com/prettier/eslint-plugin-prettier#recommended-configuration`
    // 'prettier' //注意：prettier已经合并@typescript-eslint 已经合并进 prettier，确保在最后一个
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-empty-function': 'off',
    'vue/valid-v-for': 0,
    'no-case-declarations': 0,
    'vue/attributes-order': 0,
    'vue/require-v-for-key': 0,
    'vue/multi-word-component-names': 0,
    'vue/require-default-prop': 0,
    'vue/no-mutating-props': 0,
    'vue/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'comma-dangle': 'off',
    'comma-spacing': 'off',
    'comma-style': [2, 'last'],
    'vue/no-unused-components': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'vue/html-self-closing': 'off',
    'vue/no-setup-props-destructure': 0,
    'vue/require-toggle-inside-transition': 'off',
    'no-undef': 'off'
  }
}
