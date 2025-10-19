import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  {
    ignores: [
      "next-env.d.ts",
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
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "plugin:@lexical/recommended",
  ),
  ...compat.plugins(
    "immer",
    "import",
    "simple-import-sort",
    "@typescript-eslint",
    "readable-tailwind",
  ),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "react-hooks/refs": 0,
      "@typescript-eslint/triple-slash-reference": 0,
      "import/no-unresolved": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-unsafe-member-access": 0,
      "@typescript-eslint/no-unsafe-assignment": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unsafe-call": 0,
      "import/no-named-as-default": 0,
      "@typescript-eslint/no-unsafe-return": 0,
      "@typescript-eslint/no-empty-object-type": 0,
      "@typescript-eslint/no-unused-vars": 0,
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
      "no-console": 0,
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
          callees: ["tw", "twMerge", "cva", "cn", "clsx"],
          printWidth: 80,
        },
      ],
      "readable-tailwind/no-unnecessary-whitespace": [
        "warn",
        {
          callees: ["tw", "twMerge", "cva", "cn", "clsx"],
        },
      ],
      "readable-tailwind/sort-classes": [
        "warn",
        {
          callees: ["tw", "twMerge", "cva", "cn", "clsx"],
        },
      ],
      "readable-tailwind/no-duplicate-classes": [
        "error",
        {
          callees: ["tw", "twMerge", "cva", "cn", "clsx"],
        },
      ],
    },
  },
];

export default eslintConfig;
