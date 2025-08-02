import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

// This was confusijng to me, so I removed it.
// export default defineConfig([
//   globalIgnores(["eslint.config.mjs", "node_modules/", "**/*.config.js"]),
//   {
//     files: ["**/*.{js,mjs,cjs}"],
//     languageOptions: {
//       ecmaVersion: "latest",
//       sourceType: "commonjs",
//       globals: {
//         ...globals.node,
//       },
//     },
//     plugins: {js, prettier: prettierPlugin },
//     extends: ["js/recommended"],
//   },
//   {
//     rules: {
//       "prettier/prettier": "warn",
//       // ESLint: Errors and code quality
//       "no-undef": "warn", // Prevents the use of undeclared variables
//       "no-unused-vars": ["warn", {
//         argsIgnorePattern: "^(req|res|next|error|_)",
//         varsIgnorePattern: "^(req|res|next|error|_)"
//       }],
//       // EsLint: Styles and Best Practices
//       eqeqeq: ["warn", "always"], // Requires the use of === and !==
//       "consistent-return": "error", // Requires the use of return statements in functions
//       "prefer-const": "error", // Requires the use of const instead of var
//       "no-var": "error", // Prohibits the use of the var keyword
//       "arrow-body-style": ["error", "as-needed"], // Requires the use of arrow functions when possible
//     },
//   },
// ]);


// ESLint configuration file
// This file is used to configure ESLint for the project.

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,
]);
