import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "src/api"),
      "@const": path.resolve(__dirname, "src/shared/const"),
      "@features": path.resolve(__dirname, "src/features"),
      "@images": path.resolve(__dirname, "src/shared/assets/images"),
      "@store": path.resolve(__dirname, "src/services/store"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});

