import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "no-undef": 0,
      "no-unused-vars": 0,
    },
  },
  pluginJs.configs.recommended,
];
