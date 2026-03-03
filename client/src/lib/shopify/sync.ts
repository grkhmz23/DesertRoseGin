/**
 * Shopify Product Sync Utilities
 * Helper functions to sync products between Shopify and our app
 */

import { shopifyClient } from './client';
import { shopifyProductMapping, updateVariantMapping, type ProductMapping } from './products';
import type { ShopifyProduct } from '../../../../shared/shopify-schema';

/**
 * Fetch products from Shopify by handles and update the local mapping
 */
export async function syncProductMappingFromShopify(): Promise<{
  success: boolean;
  products: ProductMapping[];
  errors: string[];
}> {
  const handles = Object.values(shopifyProductMapping).map(p => p.shopifyHandle);
  const errors: string[] = [];
  
  try {
    const products = await shopifyClient.getProductsByHandles(handles);
    
    for (const shopifyProduct of products) {
      // Find matching internal product by handle
      const internalProduct = Object.values(shopifyProductMapping).find(
        p => p.shopifyHandle === shopifyProduct.handle
      );
      
      if (!internalProduct) {
        errors.push(`No internal mapping found for Shopify product: ${shopifyProduct.handle}`);
        continue;
      }
      
      // Update variant mappings based on SKU or title matching
      for (const variantEdge of shopifyProduct.variants.edges) {
        const variant = variantEdge.node;
        
        // Try to match by SKU first, then by title
        const internalVariant = internalProduct.variants.find(v => {
          if (variant.sku && v.sku === variant.sku) return true;
          // Try to match by title/size
          return variant.title.toLowerCase().includes(v.size.toLowerCase()) ||
                 v.size.toLowerCase().includes(variant.title.toLowerCase());
        });
        
        if (internalVariant) {
          updateVariantMapping(
            internalProduct.id,
            internalVariant.size,
            variant.id
          );
        } else {
          errors.push(
            `Could not match variant "${variant.title}" (${variant.sku}) ` +
            `for product "${shopifyProduct.title}"`
          );
        }
      }
      
      // Update product ID
      internalProduct.shopifyProductId = shopifyProduct.id;
    }
    
    return {
      success: errors.length === 0,
      products: Object.values(shopifyProductMapping),
      errors,
    };
  } catch (error) {
    return {
      success: false,
      products: Object.values(shopifyProductMapping),
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Fetch a single product by handle and update mapping
 */
export async function syncSingleProduct(handle: string): Promise<{
  success: boolean;
  product?: ShopifyProduct;
  error?: string;
}> {
  try {
    // Note: We'd need to add getProductByHandle to the client
    // For now, fetch all and filter
    const products = await shopifyClient.getProductsByHandles([handle]);
    const product = products[0];
    
    if (!product) {
      return { success: false, error: `Product not found: ${handle}` };
    }
    
    return { success: true, product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Build cart items from Shopify product data
 */
export function buildCartItemsFromShopify(
  product: ShopifyProduct,
  quantity: number = 1
): Array<{ merchandiseId: string; quantity: number }> {
  return product.variants.edges.map(({ node }) => ({
    merchandiseId: node.id,
    quantity,
  }));
}

/**
 * Check if a product is available for sale
 */
export function isProductAvailable(product: ShopifyProduct): boolean {
  return product.variants.edges.some(({ node }) => node.availableForSale);
}

/**
 * Get the display price for a product
 */
export function getDisplayPrice(product: ShopifyProduct): string {
  const minPrice = product.priceRange.minVariantPrice;
  const maxPrice = product.priceRange.maxVariantPrice;
  
  if (minPrice.amount === maxPrice.amount) {
    return `${minPrice.amount} ${minPrice.currencyCode}`;
  }
  
  return `${minPrice.amount} - ${maxPrice.amount} ${minPrice.currencyCode}`;
}
