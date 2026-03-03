/**
 * Shopify Storefront API exports
 */

export { shopifyClient } from './client';
export { 
  shopifyProductMapping, 
  getShopifyVariantId, 
  getShopifyHandle,
  updateVariantMapping,
  isProductMappingComplete,
  getConfiguredVariantIds,
  type ProductMapping,
  type ProductVariantMapping,
} from './products';
export { 
  syncProductMappingFromShopify, 
  syncSingleProduct,
  buildCartItemsFromShopify,
  isProductAvailable,
  getDisplayPrice,
} from './sync';
