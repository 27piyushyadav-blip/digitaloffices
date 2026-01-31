import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**"
    ],
  },
  {
    rules: {
      // Custom rule overrides
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off", // We use a wrapper, but sometimes raw img is needed
    }
  }
];

export default eslintConfig;