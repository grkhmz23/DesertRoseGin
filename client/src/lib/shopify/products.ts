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
    shopifyHandle: 'desert-rose-gin-classic-edition-500ml',
    shopifyProductId: 'gid://shopify/Product/10783154274568',
    name: 'Desert Rose Gin Classic Edition',
    description: 'Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.',
    batch: '042',
    abv: '43%',
    variants: [
      {
        size: '50cl Bottle',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428691599624',
        sku: 'DRG-CLASSIC-500',
      },
      {
        size: '200ml Bottle',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428696580360',
        sku: 'DRG-CLASSIC-200',
      },
      {
        size: 'Box of 6 x 50cl',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428695433480',
        sku: 'DRG-CLASSIC-BOX6',
      },
      {
        size: '500ml Gift Box',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428725580040',
        sku: 'DRG-CLASSIC-GIFT',
      },
      {
        size: '2 x 500ml Gift Box',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383335665928',
        sku: 'DRG-CLASSIC-DUO-GIFT',
      },
      {
        size: '2 x Box of 6 x 50cl',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383338877192',
        sku: 'DRG-CLASSIC-BOX12',
      },
      {
        size: 'Box of 10 x 20cl',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428696580360',
        sku: 'DRG-CLASSIC-BOX10-200',
      },
      {
        size: 'Cocktail Booklet',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383340089608',
        sku: 'DRG-CLASSIC-BOOKLET',
      },
    ],
  },
  
  limited: {
    id: 'limited',
    shopifyHandle: 'desert-rose-gin-limited-edition-500ml',
    shopifyProductId: 'gid://shopify/Product/10783166103816',
    name: 'Desert Rose Gin Limited Edition',
    description: 'Organic high-quality distillate created from a fusion of Saharan and Asian botanicals.',
    batch: '001',
    abv: '43%',
    variants: [
      {
        size: '50cl Bottle',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428726104328',
        sku: 'DRG-LIMITED-500',
      },
      {
        size: 'Box of 6 x 50cl',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428728004872',
        sku: 'DRG-LIMITED-BOX6',
      },
      {
        size: '500ml Gift Box',
        shopifyVariantId: 'gid://shopify/ProductVariant/53428728758536',
        sku: 'DRG-LIMITED-GIFT',
      },
      {
        size: '2 x 500ml Bottle',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383353393416',
        sku: 'DRG-LIMITED-DUO',
      },
      {
        size: '2 x 500ml Gift Box',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383361814792',
        sku: 'DRG-LIMITED-DUO-GIFT',
      },
      {
        size: '2 x Box of 6 x 50cl',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383365746952',
        sku: 'DRG-LIMITED-BOX12',
      },
      {
        size: 'Cocktail Booklet',
        shopifyVariantId: 'gid://shopify/ProductVariant/55383952064776',
        sku: 'DRG-LIMITED-BOOKLET',
      },
    ],
  },
};

export const shopifySetsMapping: Record<string, { shopifyHandle: string; shopifyVariantId: string }> = {
  signatureDuo: {
    shopifyHandle: 'signature-duo-2x-classic-500ml-with-cocktail-booklet',
    shopifyVariantId: 'gid://shopify/ProductVariant/56242289246472',
  },
  desertSpringBox: {
    shopifyHandle: 'desert-spring-box-classic-limited-in-gift-box',
    shopifyVariantId: 'gid://shopify/ProductVariant/56242394497288',
  },
  discoveryKit: {
    shopifyHandle: 'discovery-kit-limited-500ml-classic-200ml',
    shopifyVariantId: 'gid://shopify/ProductVariant/56242453217544',
  },
  partyBox10: {
    shopifyHandle: 'party-box-10x-mini-classic-100ml',
    shopifyVariantId: 'gid://shopify/ProductVariant/56242769920264',
  },
  partyBox20: {
    shopifyHandle: 'party-box-large-20x-mini-classic-100ml',
    shopifyVariantId: 'gid://shopify/ProductVariant/56244689961224',
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
