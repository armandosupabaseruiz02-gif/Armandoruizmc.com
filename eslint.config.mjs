// ESLint flat config (ESLint 9 + Next 16).
// `next lint` fue eliminado en Next 16; ahora `npm run lint` ejecuta ESLint
// directo con la config oficial de Next (core-web-vitals), igual que antes.
import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
];

export default config;
