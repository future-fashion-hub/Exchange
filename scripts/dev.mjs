import { createServer } from "vite";
import { inlineViteConfig } from "./vite.inline.config.mjs";

const server = await createServer(inlineViteConfig);
await server.listen();
server.printUrls();

