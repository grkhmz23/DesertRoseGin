/**
 * Shopify Product Mapping
 *
 * HOW VARIANT IDs WORK IN SHOPIFY
 * ─────────────────────────────────────────────────────────────────────────────
 * Shopify has two different types of IDs:
 *   • Product ID  → gid://shopify/Product/XXXXXXXXXX   (identifies the product)
 *   • Variant ID  → gid://shopify/ProductVariant/XXXXXXXXXX  (used for the cart)
 *
 * The cart API requires Variant IDs. Each product has at least one variant;
 * simple products (no size/colour options) have exactly ONE default variant.
 *
 * HOW TO FIND VARIANT IDs IN SHOPIFY ADMIN
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Go to Shopify Admin → Products
 * 2. Click on the product
 * 3. Click on the variant (or "Default Title" if there is only one)
 * 4. The URL will be: /admin/products/PRODUCT_ID/variants/VARIANT_ID
 *    Copy the VARIANT_ID number
 * 5. The full GID format is: gid://shopify/ProductVariant/VARIANT_ID
 *
 * Each entry below shows:
 *   shopifyProductId  — the Product GID you provided (confirmed correct)
 *   shopifyVariantId  — the Variant GID needed for the cart (fill these in)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface ProductVariantMapping {
  /** Internal label matching the shopifyLookupSize in desert-rose-gallery-landing.tsx */
  size: string;
  /** gid://shopify/Product/... — confirmed from client's product list */
  shopifyProductId: string;
  /** gid://shopify/ProductVariant/... — required for cart; get from Shopify Admin */
  shopifyVariantId: string;
  sku?: string;
}

export interface ProductMapping {
  id: string;
  shopifyHandle: string;
  shopifyProductId?: string;
  name: string;
  description: string;
  batch: string;
  abv: string;
  variants: ProductVariantMapping[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CLASSIC EDITION — 7 options, each is a separate Shopify product
// ─────────────────────────────────────────────────────────────────────────────
const classicVariants: ProductVariantMapping[] = [
  {
    size: '50cl Bottle',
    shopifyProductId: 'gid://shopify/Product/10783154274568',   // #1  Classic Edition 500ml
    shopifyVariantId: 'gid://shopify/ProductVariant/53428691599624',
    sku: 'DRG-CLASSIC-500',
  },
  {
    size: '500ml Gift Box',
    shopifyProductId: 'gid://shopify/Product/10783165677832',   // #4  Classic Edition 500ml Gift Box
    shopifyVariantId: 'gid://shopify/ProductVariant/53428725580040',
    sku: 'DRG-CLASSIC-GIFT',
  },
  {
    size: '2 x 500ml Gift Box',
    shopifyProductId: 'gid://shopify/Product/11336128626952',   // #8  Classic 2x 500ml + Gift Box
    shopifyVariantId: 'gid://shopify/ProductVariant/55383335665928',
    sku: 'DRG-CLASSIC-DUO-GIFT',
  },
  {
    size: 'Box of 6 x 50cl',
    shopifyProductId: 'gid://shopify/Product/10783156109576',   // #2  Classic Edition 6x 500ml Box
    shopifyVariantId: 'gid://shopify/ProductVariant/53428695433480',
    sku: 'DRG-CLASSIC-BOX6',
  },
  {
    size: '2 x Box of 6 x 50cl',
    shopifyProductId: 'gid://shopify/Product/11336128758024',   // #9  Classic 2x Box da 6 500ml
    shopifyVariantId: 'gid://shopify/ProductVariant/55383338877192',
    sku: 'DRG-CLASSIC-BOX12',
  },
  {
    size: 'Box of 10 x 20cl',
    shopifyProductId: 'gid://shopify/Product/10783156633864',   // #3  Classic Edition 200ml
    shopifyVariantId: 'gid://shopify/ProductVariant/53428696580360',
    sku: 'DRG-CLASSIC-BOX10-200',
  },
  {
    size: 'Cocktail Booklet',
    shopifyProductId: 'gid://shopify/Product/11336128921864',   // #10 Cocktail Booklet
    shopifyVariantId: 'gid://shopify/ProductVariant/55383340089608',
    sku: 'DRG-CLASSIC-BOOKLET',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LIMITED EDITION — 7 options, each is a separate Shopify product
// ─────────────────────────────────────────────────────────────────────────────
const limitedVariants: ProductVariantMapping[] = [
  {
    size: '50cl Bottle',
    shopifyProductId: 'gid://shopify/Product/10783166103816',   // #5  Limited Edition 500ml
    shopifyVariantId: 'gid://shopify/ProductVariant/53428726104328',
    sku: 'DRG-LIMITED-500',
  },
  {
    size: '500ml Gift Box',
    shopifyProductId: 'gid://shopify/Product/10783167676680',   // #7  Limited Edition 500ml Gift Box
    shopifyVariantId: 'gid://shopify/ProductVariant/53428728758536',
    sku: 'DRG-LIMITED-GIFT',
  },
  {
    size: '2 x 500ml Bottle',
    shopifyProductId: 'gid://shopify/Product/11336130134280',   // #11 Limited 2x 500ml
    shopifyVariantId: 'gid://shopify/ProductVariant/55383353393416',
    sku: 'DRG-LIMITED-DUO',
  },
  {
    size: '2 x 500ml Gift Box',
    shopifyProductId: 'gid://shopify/Product/11336130724104',   // #12 Limited 2x 500ml + Gift Box
    shopifyVariantId: 'gid://shopify/ProductVariant/55383361814792',
    sku: 'DRG-LIMITED-DUO-GIFT',
  },
  {
    size: 'Box of 6 x 50cl',
    shopifyProductId: 'gid://shopify/Product/10783167086856',   // #6  Limited Edition 6x 500ml Box
    shopifyVariantId: 'gid://shopify/ProductVariant/53428728004872',
    sku: 'DRG-LIMITED-BOX6',
  },
  {
    size: '2 x Box of 6 x 50cl',
    shopifyProductId: 'gid://shopify/Product/11336131412232',   // #13 Limited 2x Box da 6 500ml
    shopifyVariantId: 'gid://shopify/ProductVariant/55383365746952',
    sku: 'DRG-LIMITED-BOX12',
  },
  {
    size: 'Cocktail Booklet',
    shopifyProductId: 'gid://shopify/Product/11336301838600',   // #14 Limited Edition Cocktail Booklet
    shopifyVariantId: 'gid://shopify/ProductVariant/55383952064776',
    sku: 'DRG-LIMITED-BOOKLET',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT MAPPING — used by getShopifyVariantId() and getShopifyHandle()
// ─────────────────────────────────────────────────────────────────────────────
export const shopifyProductMapping: Record<string, ProductMapping> = {
  classic: {
    id: 'classic',
    shopifyHandle: 'desert-rose-gin-classic-edition-500ml',
    shopifyProductId: 'gid://shopify/Product/10783154274568',
    name: 'Desert Rose Gin Classic Edition',
    description: 'Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.',
    batch: '042',
    abv: '43%',
    variants: classicVariants,
  },

  limited: {
    id: 'limited',
    shopifyHandle: 'desert-rose-gin-limited-edition-500ml',
    shopifyProductId: 'gid://shopify/Product/10783166103816',
    name: 'Desert Rose Gin Limited Edition',
    description: 'Organic high-quality distillate created from a fusion of Saharan and Asian botanicals.',
    batch: '001',
    abv: '43%',
    variants: limitedVariants,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SETS MAPPING — 5 separate Shopify products
// shopifyVariantId = variant ID needed for cart (get from Shopify Admin)
// ─────────────────────────────────────────────────────────────────────────────
export const shopifySetsMapping: Record<string, {
  shopifyHandle: string;
  shopifyProductId: string;
  shopifyVariantId: string;
}> = {
  discoveryKit: {
    shopifyHandle: 'discovery-kit-limited-500ml-classic-200ml',
    shopifyProductId: 'gid://shopify/Product/11565036077320',   // #17 Discovery Kit
    shopifyVariantId: 'gid://shopify/ProductVariant/56242453217544',
  },
  signatureDuo: {
    shopifyHandle: 'signature-duo-2x-classic-500ml-with-cocktail-booklet',
    shopifyProductId: 'gid://shopify/Product/11565003833608',   // #15 Signature Duo
    shopifyVariantId: 'gid://shopify/ProductVariant/56242289246472',
  },
  desertSpringBox: {
    shopifyHandle: 'desert-spring-box-classic-limited-in-gift-box',
    shopifyProductId: 'gid://shopify/Product/11565025100040',   // #16 Desert Spring Box
    shopifyVariantId: 'gid://shopify/ProductVariant/56242394497288',
  },
  partyBox10: {
    shopifyHandle: 'party-box-10x-mini-classic-100ml',
    shopifyProductId: 'gid://shopify/Product/11565113901320',   // #18 Party Box 10x Mini
    shopifyVariantId: 'gid://shopify/ProductVariant/56242769920264',
  },
  partyBox20: {
    shopifyHandle: 'party-box-large-20x-mini-classic-100ml',
    shopifyProductId: 'gid://shopify/Product/11565657784584',   // #19 Party Box Large 20x Mini
    shopifyVariantId: 'gid://shopify/ProductVariant/56244689961224',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the Variant GID for a product + size combination */
export function getShopifyVariantId(productId: string, size: string): string | undefined {
  const product = shopifyProductMapping[productId];
  if (!product) return undefined;
  const variant = product.variants.find(v => v.size === size);
  return variant?.shopifyVariantId || undefined;
}

/** Returns the primary product handle */
export function getShopifyHandle(productId: string): string | undefined {
  return shopifyProductMapping[productId]?.shopifyHandle;
}

/** Updates a variant ID at runtime (used by the sync utility) */
export function updateVariantMapping(
  productId: string,
  size: string,
  shopifyVariantId: string,
): void {
  const product = shopifyProductMapping[productId];
  if (!product) return;
  const variant = product.variants.find(v => v.size === size);
  if (variant) {
    variant.shopifyVariantId = shopifyVariantId;
  }
}

/** Returns true only when every variant has a non-empty variant ID */
export function isProductMappingComplete(): boolean {
  return Object.values(shopifyProductMapping).every(product =>
    product.variants.every(variant => variant.shopifyVariantId !== ''),
  );
}

/** Returns all currently configured variant GIDs */
export function getConfiguredVariantIds(): string[] {
  const ids: string[] = [];
  Object.values(shopifyProductMapping).forEach(product => {
    product.variants.forEach(variant => {
      if (variant.shopifyVariantId) ids.push(variant.shopifyVariantId);
    });
  });
  return ids;
}
