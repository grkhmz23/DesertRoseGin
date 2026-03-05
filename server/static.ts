import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        const normalized = filePath.replace(/\\/g, "/");

        // HTML must not be cached by CDN/browser to avoid stale bundle references.
        if (normalized.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
          return;
        }

        // Fingerprinted assets can be cached aggressively.
        if (/\/assets\/.+-[A-Za-z0-9_-]{6,}\.(js|css|png|jpe?g|webp|svg|woff2?|mp4|webm)$/.test(normalized)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }

        // Non-fingerprinted files get conservative caching.
        res.setHeader("Cache-Control", "public, max-age=3600");
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    if (req.path.startsWith("/api/") || req.path === "/api") {
      return res.status(404).json({ message: "Not Found" });
    }

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
