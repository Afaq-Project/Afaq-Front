import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Physical left/right Tailwind classes don't flip in Arabic (RTL); use the logical ones instead.
const PHYSICAL_CLASS =
  "/(^|[\\s\"'`:])-?(m[lr]|p[lr]|left|right)-(\\d|px|auto|full|\\[)|(^|[\\s\"'`:])(text-(left|right)|border-[lr]|rounded-[tb]?[lr])(?![\\w])/";
const physicalClassMessage =
  "Use a logical class (ms/me, ps/pe, start/end, text-start/end, border-s/e, rounded-s/e) so the layout mirrors in Arabic.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    // The landing page is English-only and left-to-right for now.
    ignores: ["src/feature/home/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: `Literal[value=${PHYSICAL_CLASS}]`, message: physicalClassMessage },
        { selector: `TemplateElement[value.raw=${PHYSICAL_CLASS}]`, message: physicalClassMessage },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
