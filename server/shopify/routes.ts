/**
 * Shopify API Routes
 * Server-side routes for Shopify Storefront API operations
 */

import type { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";
import { shopify } from "./client";

const MAX_REQUESTS_PER_MINUTE = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

const handleSchema = z.object({
  handle: z.string().min(1).max(120).regex(/^[a-z0-9][a-z0-9-]*$/i),
});

const cartIdSchema = z.object({
  cartId: z.string().min(1).max(255),
});

const cartLineInputSchema = z.object({
  merchandiseId: z.string().startsWith("gid://shopify/ProductVariant/"),
  quantity: z.number().int().min(1).max(24),
});

const cartLineUpdateSchema = z.object({
  id: z.string().min(1).max(255),
  quantity: z.number().int().min(1).max(24),
});

const createCartBodySchema = z.object({
  lines: z.array(cartLineInputSchema).max(25).optional(),
});

const addLinesBodySchema = z.object({
  lines: z.array(cartLineInputSchema).min(1).max(25),
});

const updateLinesBodySchema = z.object({
  lines: z.array(cartLineUpdateSchema).min(1).max(25),
});

const removeLinesBodySchema = z.object({
  lineIds: z.array(z.string().min(1).max(255)).min(1).max(25),
});

function withRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";
  const now = Date.now();
  const requests = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (requests.length >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: "Too many requests" });
  }

  requests.push(now);
  requestLog.set(key, requests);
  next();
}

function validate<T>(schema: z.ZodSchema<T>, payload: unknown): T {
  return schema.parse(payload);
}

function sendUpstreamError(res: Response, logMessage: string, error: unknown) {
  console.error(logMessage, error);
  return res.status(502).json({ error: "Shopify request failed" });
}

export function registerShopifyRoutes(app: Express) {
  app.use("/api/shopify", withRateLimit);

  app.get("/api/shopify/products", async (_req: Request, res: Response) => {
    try {
      const products = await shopify.getProducts(50);
      res.json({ products });
    } catch (error) {
      sendUpstreamError(res, "Error fetching products:", error);
    }
  });

  app.get("/api/shopify/products/:handle", async (req: Request, res: Response) => {
    try {
      const { handle } = validate(handleSchema, req.params);
      const product = await shopify.getProductByHandle(handle);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product handle" });
      }
      sendUpstreamError(res, "Error fetching product:", error);
    }
  });

  app.post("/api/shopify/cart", async (req: Request, res: Response) => {
    try {
      const { lines } = validate(createCartBodySchema, req.body ?? {});
      const cart = await shopify.createCart(lines);
      res.json({ cart });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart payload" });
      }
      sendUpstreamError(res, "Error creating cart:", error);
    }
  });

  app.get("/api/shopify/cart/:cartId", async (req: Request, res: Response) => {
    try {
      const { cartId } = validate(cartIdSchema, req.params);
      const cart = await shopify.getCart(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      res.json({ cart });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart ID" });
      }
      sendUpstreamError(res, "Error fetching cart:", error);
    }
  });

  app.post("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = validate(cartIdSchema, req.params);
      const { lines } = validate(addLinesBodySchema, req.body);
      const cart = await shopify.addCartLines(cartId, lines);
      res.json({ cart });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart line payload" });
      }
      sendUpstreamError(res, "Error adding to cart:", error);
    }
  });

  app.put("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = validate(cartIdSchema, req.params);
      const { lines } = validate(updateLinesBodySchema, req.body);
      const cart = await shopify.updateCartLines(cartId, lines);
      res.json({ cart });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart update payload" });
      }
      sendUpstreamError(res, "Error updating cart:", error);
    }
  });

  app.delete("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = validate(cartIdSchema, req.params);
      const { lineIds } = validate(removeLinesBodySchema, req.body);
      const cart = await shopify.removeCartLines(cartId, lineIds);
      res.json({ cart });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cart removal payload" });
      }
      sendUpstreamError(res, "Error removing from cart:", error);
    }
  });
}
