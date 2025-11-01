import tsParser from "@typescript-eslint/parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const callees = [
  "clsx",
  "cva",
  "ctl",
  "twMerge",
  "cx",
  "cn",
  ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
];

const eslintConfig = [
  {
    ignores: [
      "next-env.d.ts",
      "eslint.config.mjs",
      "postcss.config.mjs",
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      ".vercel/**",
      "coverage/**",
    ],
  },
  ...compat.extends(
    "prettier",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
  ),
  ...compat.plugins(
    "immer",
    "import",
    "simple-import-sort",
    "@typescript-eslint",
    "readable-tailwind",
    "import-alias",
  ),
  {
    files: ["**/*.{js,jsx,ts,tsx,cjs}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.json", "tsconfig.eslint.json"],
      },
    },
    rules: {
      "@typescript-eslint/require-await": 0,
      "import-alias/import-alias": [
        "error",
        {
          aliases: [
            {
              alias: "@",
              matcher: "./src",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      semi: "warn",
      curly: ["error", "multi-line"],
      "prettier/prettier": "warn",
      "no-console": "warn",
      "react/jsx-wrap-multilines": [
        "error",
        {
          prop: "ignore",
        },
      ],
      "react/state-in-constructor": ["error", "never"],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: [
            "arrow-function",
            "function-declaration",
            "function-expression",
          ],
          unnamedComponents: "arrow-function",
        },
      ],
      "immer/no-update-map": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/extensions": ["error", "never"],
      "@typescript-eslint/no-misused-promises": [
        2,
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "readable-tailwind/multiline": [
        "warn",
        {
          callees,
          printWidth: 80,
        },
      ],
      "readable-tailwind/no-unnecessary-whitespace": [
        "warn",
        {
          callees,
        },
      ],
      "readable-tailwind/sort-classes": [
        "warn",
        {
          callees,
        },
      ],
      "readable-tailwind/no-duplicate-classes": [
        "error",
        {
          callees,
        },
      ],
    },
  },
];

export default eslintConfig;
