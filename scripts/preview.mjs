import { preview } from "vite";
import { inlineViteConfig } from "./vite.inline.config.mjs";

const server = await preview(inlineViteConfig);
const protocol = server.config.preview.https ? "https" : "http";
const host = server.config.preview.host || "localhost";
const port = server.config.preview.port;

console.log(`Preview server running: ${protocol}://${host}:${port}`);

