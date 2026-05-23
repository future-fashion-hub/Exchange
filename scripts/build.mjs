import { build } from "vite";
import { inlineViteConfig } from "./vite.inline.config.mjs";

await build(inlineViteConfig);

