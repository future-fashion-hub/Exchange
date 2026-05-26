import path from "node:path";
import { startVitest } from "vitest/node";

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
    resolve: {
      alias: {
        supertest: path.resolve(root, "scripts/supertest-lite.mjs"),
      },
    },
    test: {
      environment: "node",
      globals: true,
      include: ["src/**/*.test.ts"],
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
