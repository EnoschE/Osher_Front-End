module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    "react-hooks/exhaustive-deps": 0,
    "react/react-in-jsx-scope": "off",
    "no-constant-condition": "warn",
    "no-mixed-spaces-and-tabs": "warn",
    "@typescript-eslint/no-explicit-any": ["off"],
    "react/no-unescaped-entities": "off",
    "no-mixed-spaces-and-tabs": "off",
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
