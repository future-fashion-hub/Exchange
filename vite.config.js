import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
  },
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
});

