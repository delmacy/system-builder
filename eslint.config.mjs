import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/handoff-state-machine.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        structuredClone: "readonly",
      },
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".agent/**"],
  },
);
