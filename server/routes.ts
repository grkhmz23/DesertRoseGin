import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerShopifyRoutes } from "./shopify/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/market", (req, res) => {
    const country =
      (req.headers["x-vercel-ip-country"] as string) ||
      (req.headers["cf-ipcountry"] as string) ||
      "CH";
    res.json({ country: country.toUpperCase() });
  });

  // Register Shopify routes
  registerShopifyRoutes(app);

  return httpServer;
}
