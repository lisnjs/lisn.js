import path from "path";
import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": [
        2,
        path.join(import.meta.dirname, "website/app"),
      ],
    },
  },
  {
    // re-enable some that are disabled by tseslint recommended
    rules: {
      "no-unused-labels": "off",
      "constructor-super": "error",
      "getter-return": "error",
      "no-const-assign": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-new-symbol": "error",
      "no-new-native-nonconstructor": "error",
      "no-obj-calls": "error",
      "no-setter-return": "error",
      "no-this-before-super": "error",
      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "@typescript-eslint/await-thenable": "off",
      // "no-undef": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "__ignored",
          varsIgnorePattern: "__ignored",
          caughtErrorsIgnorePattern: "__ignored",
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-unused-labels": "off",
    },
  },
  {
    ignores: [
      "**/tests/unit-tests/coverage/",
      "**/node_modules/",
      "**/assets/",
      "**/dist/",
      "**/.next/",
    ],
  },
);
