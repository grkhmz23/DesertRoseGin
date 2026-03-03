/**
 * Shopify Product Mapping
 * Maps internal product IDs to Shopify product handles and variant IDs
 * 
 * Note: These handles and variant IDs should match your actual Shopify store setup.
 * Update these values after setting up products in your Shopify admin.
 */

export interface ProductVariantMapping {
  size: string;
  shopifyVariantId: string;
  sku?: string;
}

export interface ProductMapping {
  id: string;                    // Internal ID (classic, limited)
  shopifyHandle: string;         // Shopify product handle
  shopifyProductId?: string;     // Shopify product ID (GID)
  name: string;
  description: string;
  batch: string;
  abv: string;
  variants: ProductVariantMapping[];
}

/**
 * Product mapping configuration
 * 
 * To get your Shopify variant IDs:
 * 1. Go to Shopify Admin > Products
 * 2. Click on a product
 * 3. Look at the variant IDs in the URL or use the Storefront API
 * 
 * Variant IDs should be in the format: "gid://shopify/ProductVariant/1234567890"
 * Or you can use the numeric ID: "1234567890"
 */
export const shopifyProductMapping: Record<string, ProductMapping> = {
  classic: {
    id: 'classic',
    shopifyHandle: 'desert-rose-classic-edition',
    name: 'Desert Rose Classic Edition',
    description: 'Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.',
    batch: '042',
    abv: '43%',
    variants: [
      {
        size: '500ml Bottle',
        shopifyVariantId: '', // TODO: Add your Shopify variant ID
        sku: 'DR-CLASSIC-500',
      },
      {
        size: '200ml Bottle',
        shopifyVariantId: '', // TODO: Add your Shopify variant ID
        sku: 'DR-CLASSIC-200',
      },
      {
        size: 'Gift Box Set',
        shopifyVariantId: '', // TODO: Add your Shopify variant ID
        sku: 'DR-CLASSIC-BOX',
      },
    ],
  },
  limited: {
    id: 'limited',
    shopifyHandle: 'desert-rose-limited-edition',
    name: 'Desert Rose Limited Edition',
    description: 'Organic high-quality distillate created from a fusion of Saharan and Asian botanicals. The delicate, floral taste of Darjeeling tea combines with the sweetness of date fruit, creating a complex aroma, soft on the nose and refreshing on the palate.',
    batch: '001',
    abv: '43%',
    variants: [
      {
        size: '500ml Bottle',
        shopifyVariantId: '', // TODO: Add your Shopify variant ID
        sku: 'DR-LIMITED-500',
      },
      {
        size: 'Gift Box Set',
        shopifyVariantId: '', // TODO: Add your Shopify variant ID
        sku: 'DR-LIMITED-BOX',
      },
    ],
  },
};

/**
 * Get variant ID for a product and size
 */
export function getShopifyVariantId(productId: string, size: string): string | undefined {
  const product = shopifyProductMapping[productId];
  if (!product) return undefined;
  
  const variant = product.variants.find(v => v.size === size);
  return variant?.shopifyVariantId;
}

/**
 * Get product handle for a product ID
 */
export function getShopifyHandle(productId: string): string | undefined {
  return shopifyProductMapping[productId]?.shopifyHandle;
}

/**
 * Update variant ID mapping
 * Call this after fetching products from Shopify to update the mapping dynamically
 */
export function updateVariantMapping(
  productId: string, 
  size: string, 
  shopifyVariantId: string
): void {
  const product = shopifyProductMapping[productId];
  if (!product) return;
  
  const variant = product.variants.find(v => v.size === size);
  if (variant) {
    variant.shopifyVariantId = shopifyVariantId;
  }
}

/**
 * Check if all variant IDs are configured
 */
export function isProductMappingComplete(): boolean {
  return Object.values(shopifyProductMapping).every(product => 
    product.variants.every(variant => variant.shopifyVariantId !== '')
  );
}

/**
 * Get configured variant IDs as an array
 */
export function getConfiguredVariantIds(): string[] {
  const ids: string[] = [];
  Object.values(shopifyProductMapping).forEach(product => {
    product.variants.forEach(variant => {
      if (variant.shopifyVariantId) {
        ids.push(variant.shopifyVariantId);
      }
    });
  });
  return ids;
}
