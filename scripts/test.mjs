import path from "node:path";
import { startVitest } from "vitest/node";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const root = process.cwd();
const watchMode = process.argv.includes("--watch");

const vitest = await startVitest(
  "test",
  [],
  {
    run: !watchMode,
    watch: watchMode,
    passWithNoTests: false,
  },
  {
    configFile: false,
    root,
    plugins: [react(), svgr()],
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
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  },
);

if (!vitest) {
  process.exit(1);
}

if (!watchMode) {
  const failed = vitest.state.getCountOfFailedTests();
  await vitest.close();
  process.exit(failed > 0 ? 1 : 0);
}

