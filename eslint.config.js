import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";

// eslint-disable-next-line no-undef
const cwd = process.cwd();

export default defineConfig(
  // Ignores
  includeIgnoreFile(path.resolve(cwd, ".gitignore")),

  // ESLint recommended
  {
    name: "eslint/recommended",
    ...eslint.configs.recommended,
  },

  // typescript-eslint strict-type-checked + stylistic-type-checked
  tseslint.configs.base,
  {
    ...tseslint.configs.eslintRecommended,
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts", "**/*.vue"],
  },
  tseslint.configs.strictTypeChecked[2],
  tseslint.configs.stylisticTypeChecked[2],

  // Perfectionist recommended-natural
  {
    name: "perfectionist/recommended-natural",
    ...perfectionist.configs["recommended-natural"],
  },

  // eslint-plugin-unicorn recommended
  eslintPluginUnicorn.configs.recommended,

  // Custom typescript config
  {
    name: "derviloper/typescript",
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: cwd },
    },
    linterOptions: { reportUnusedDisableDirectives: true },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "array-callback-return": ["error", { checkForEach: true }],
      eqeqeq: ["error"],
      "func-style": ["error", "declaration"],
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: {
            defaultFrom: true,
            direct: true,
            named: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        { newlinesBetween: "never", order: "asc", type: "natural" },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^(?:id|name)$",
              groupName: "top",
              selector: "property",
            },
          ],
          groups: ["top", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^(?:id|name)$",
              groupName: "top",
              selector: "property",
            },
          ],
          groups: ["top", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          customGroups: { top: "^(?:id|name)$" },
          groups: ["top", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
      "perfectionist/sort-union-types": [
        "error",
        {
          groups: ["unknown", "operator", "literal", "keyword", "nullish"],
          order: "asc",
          type: "natural",
        },
      ],
      "unicorn/filename-case": ["error", { case: "camelCase" }],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          replacements: {
            prop: false,
            props: false,
            ref: false,
            refs: false,
          },
        },
      ],
      "unicorn/switch-case-braces": ["error", "avoid"],
    },
  },

  // Config ignores
  {
    name: "derviloper/config-ignores",
    files: ["*.config.js", "*.config.ts"],
    rules: {
      "no-restricted-exports": ["off"],
    },
  },

  // eslint-config-prettier
  { name: "eslint-config-prettier", ...eslintConfigPrettier },
);
