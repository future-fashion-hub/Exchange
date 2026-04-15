// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr() // это для иконок-компонентов
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@const': path.resolve(__dirname, 'src/shared/const'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@images': path.resolve(__dirname, 'src/shared/assets/images'),
      '@store': path.resolve(__dirname, 'src/services/store'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
    }
  }

});
