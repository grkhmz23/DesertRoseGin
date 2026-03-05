import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "src", "assets"), // Updated to point to the clean folder
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
              return "vendor-react";
            }
            if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) {
              return "vendor-motion";
            }
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "vendor-i18n";
            }
            if (id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            return "vendor";
          }
        },
      },
    },
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
    ],
  },

});
