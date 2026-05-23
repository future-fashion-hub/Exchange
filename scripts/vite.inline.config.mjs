import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

const root = process.cwd();

export const inlineViteConfig = {
  configFile: false,
  root,
  plugins: [react(), svgr()],
  server: {
    host: "localhost",
    port: 3000,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@api": path.resolve(root, "src/api"),
      "@const": path.resolve(root, "src/shared/const"),
      "@features": path.resolve(root, "src/features"),
      "@images": path.resolve(root, "src/shared/assets/images"),
      "@store": path.resolve(root, "src/services/store"),
      "@widgets": path.resolve(root, "src/widgets"),
    },
  },
};

