/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
  {
    ignores: [".sandcastle/**"]
  },
  {
    space: true,
    prettier: true,
    rules: {
      // The project uses bundler module resolution; relative imports are
      // intentionally extensionless.
      "import-x/extensions": "off",
      // Keep hex colour literals and small numeric constants readable instead of
      // forcing `0xff_00_42`-style grouping.
      "unicorn/numeric-separators-style": "off",
      // Three.js exposes shader uniform values as `any`, so arithmetic on them
      // and narrowing loader results to `Mesh` are unavoidable.
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"]
    }
  },
  {
    // Vite config files live outside the `src` tsconfig, so type-aware rules
    // cannot resolve `defineConfig`.
    files: ["*.config.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off"
    }
  }
];

export default xoConfig;
