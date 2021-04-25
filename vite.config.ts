import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/lib/space-travel.ts",
      name: "SpaceTravel",
      formats: ["es"]
    }
  }
});
