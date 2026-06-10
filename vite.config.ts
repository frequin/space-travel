import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

export default defineConfig({
  plugins: [dts({ tsconfigPath: "tsconfig.build.json", bundleTypes: true })],
  build: {
    lib: {
      entry: "src/lib/space-travel.ts",
      name: "SpaceTravel",
      formats: ["es"],
      fileName: (format) => `space-travel.${format}.js`
    }
  }
});
