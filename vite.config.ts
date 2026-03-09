import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Only use Replit plugin in development
const runtimeErrorOverlay = async () => {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const mod = await import("@replit/vite-plugin-runtime-error-modal");
    return mod.default();
  } catch {
    return null;
  }
};

export default defineConfig(async () => ({
  plugins: [react(), await runtimeErrorOverlay()].filter(Boolean),
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "src", "assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    strictPort: true,
    cors: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".replit.dev",
      ".worf.replit.dev",
      ".repl.co",
      ".vercel.app",
    ],
  },
}));
