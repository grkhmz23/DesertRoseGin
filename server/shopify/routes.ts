/**
 * Shopify API Routes
 * Server-side routes for Shopify Storefront API operations
 */

import type { Express, Request, Response } from "express";
import { shopify } from "./client";

export function registerShopifyRoutes(app: Express) {
  // Get all products
  app.get("/api/shopify/products", async (_req: Request, res: Response) => {
    try {
      const products = await shopify.getProducts(50);
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get product by handle
  app.get("/api/shopify/products/:handle", async (req: Request, res: Response) => {
    try {
      const { handle } = req.params;
      const product = await shopify.getProductByHandle(handle);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json({ product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ 
        error: "Failed to fetch product",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create a new cart
  app.post("/api/shopify/cart", async (req: Request, res: Response) => {
    try {
      const { lines } = req.body;
      const cart = await shopify.createCart(lines);
      res.json({ cart });
    } catch (error) {
      console.error("Error creating cart:", error);
      res.status(500).json({ 
        error: "Failed to create cart",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get cart by ID
  app.get("/api/shopify/cart/:cartId", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const cart = await shopify.getCart(cartId);
      
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      res.json({ cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ 
        error: "Failed to fetch cart",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Add lines to cart
  app.post("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const { lines } = req.body;
      
      if (!lines || !Array.isArray(lines)) {
        return res.status(400).json({ error: "Lines array is required" });
      }
      
      const cart = await shopify.addCartLines(cartId, lines);
      res.json({ cart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ 
        error: "Failed to add to cart",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update cart lines
  app.put("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const { lines } = req.body;
      
      if (!lines || !Array.isArray(lines)) {
        return res.status(400).json({ error: "Lines array is required" });
      }
      
      const cart = await shopify.updateCartLines(cartId, lines);
      res.json({ cart });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ 
        error: "Failed to update cart",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Remove lines from cart
  app.delete("/api/shopify/cart/:cartId/lines", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      const { lineIds } = req.body;
      
      if (!lineIds || !Array.isArray(lineIds)) {
        return res.status(400).json({ error: "lineIds array is required" });
      }
      
      const cart = await shopify.removeCartLines(cartId, lineIds);
      res.json({ cart });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ 
        error: "Failed to remove from cart",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
