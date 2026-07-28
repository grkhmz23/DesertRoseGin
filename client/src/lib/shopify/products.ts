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
  /** Apparel bundles only: the bundle is one Shopify product with combined Gender+Size variants */
  gender?: 'men' | 'women';
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
// APPAREL — Polo Shirts & T-Shirts, sold as separate Men's/Women's products
// (each garment has distinct copy, fit and size range — modeled as separate
// Shopify products rather than a single product with a gender option).
// ─────────────────────────────────────────────────────────────────────────────
const MENS_POLO_PRODUCT_ID = 'gid://shopify/Product/12136669118728';
const WOMENS_POLO_PRODUCT_ID = 'gid://shopify/Product/12136647262472';
const MENS_TSHIRT_PRODUCT_ID = 'gid://shopify/Product/12136671871240';
const WOMENS_TSHIRT_PRODUCT_ID = 'gid://shopify/Product/12136672788744';

const mensPoloVariants: ProductVariantMapping[] = [
  { size: 'M', shopifyProductId: MENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565572872' },
  { size: 'L', shopifyProductId: MENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565605640' },
  { size: 'XL', shopifyProductId: MENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565638408' },
  { size: '2XL', shopifyProductId: MENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565671176' },
];

const womensPoloVariants: ProductVariantMapping[] = [
  { size: 'S', shopifyProductId: WOMENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565802248' },
  { size: 'M', shopifyProductId: WOMENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565835016' },
  { size: 'L', shopifyProductId: WOMENS_POLO_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318565867784' },
];

const mensTshirtVariants: ProductVariantMapping[] = [
  { size: 'M', shopifyProductId: MENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318582120712' },
  { size: 'L', shopifyProductId: MENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318582153480' },
  { size: 'XL', shopifyProductId: MENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318582186248' },
  { size: '2XL', shopifyProductId: MENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318582219016' },
];

const womensTshirtVariants: ProductVariantMapping[] = [
  { size: 'S', shopifyProductId: WOMENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318583693576' },
  { size: 'M', shopifyProductId: WOMENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318583726344' },
  { size: 'L', shopifyProductId: WOMENS_TSHIRT_PRODUCT_ID, shopifyVariantId: 'gid://shopify/ProductVariant/58318583759112' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT MAPPING — used by getShopifyVariantId() and getShopifyHandle()
// ─────────────────────────────────────────────────────────────────────────────
export const shopifyProductMapping: Record<string, ProductMapping> = {
  mensPolo: {
    id: 'mensPolo',
    shopifyHandle: '',
    shopifyProductId: MENS_POLO_PRODUCT_ID,
    name: "Desert Rose Gin Men's Polo Shirt",
    description: '100% organic cotton, regular fit, classic collar with button closure.',
    batch: '',
    abv: '',
    variants: mensPoloVariants,
  },

  womensPolo: {
    id: 'womensPolo',
    shopifyHandle: '',
    shopifyProductId: WOMENS_POLO_PRODUCT_ID,
    name: "Desert Rose Gin Women's Polo Shirt",
    description: '100% organic cotton, slightly contoured feminine fit, classic collar with button closure.',
    batch: '',
    abv: '',
    variants: womensPoloVariants,
  },

  mensTshirt: {
    id: 'mensTshirt',
    shopifyHandle: '',
    shopifyProductId: MENS_TSHIRT_PRODUCT_ID,
    name: "Desert Rose Gin Men's T-Shirt",
    description: '100% organic cotton, regular fit, reinforced crew neck.',
    batch: '',
    abv: '',
    variants: mensTshirtVariants,
  },

  womensTshirt: {
    id: 'womensTshirt',
    shopifyHandle: '',
    shopifyProductId: WOMENS_TSHIRT_PRODUCT_ID,
    name: "Desert Rose Gin Women's T-Shirt",
    description: '100% organic cotton, slightly contoured feminine fit, reinforced crew neck.',
    batch: '',
    abv: '',
    variants: womensTshirtVariants,
  },

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
// SETS MAPPING — gin bundles use a single shopifyVariantId (no size options).
// Apparel bundles additionally carry a `variants` array (one per garment size)
// since the customer must pick a size before adding the bundle to cart.
// ─────────────────────────────────────────────────────────────────────────────
export interface SetMapping {
  shopifyHandle: string;
  shopifyProductId: string;
  shopifyVariantId: string;
  /** Present only for bundles that require a size selection (apparel bundles) */
  variants?: ProductVariantMapping[];
}

export const shopifySetsMapping: Record<string, SetMapping> = {
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

  // ── Apparel bundles: Polo/T-Shirt + 1x 100ml Classic + 1x 100ml Limited ─────
  // Each bundle is ONE Shopify product with combined Gender+Size variants
  // (Shopify variant titles are e.g. "S / Female", "M / Male").
  poloBundle: {
    shopifyHandle: '',
    shopifyProductId: 'gid://shopify/Product/12136699461896',
    shopifyVariantId: '',
    variants: [
      { size: 'S', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318667940104' },
      { size: 'M', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318668202248' },
      { size: 'L', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318668136712' },
      { size: 'M', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318668169480' },
      { size: 'L', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318668103944' },
      { size: 'XL', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318668038408' },
      { size: '2XL', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136699461896', shopifyVariantId: 'gid://shopify/ProductVariant/58318667972872' },
    ],
  },
  tshirtBundle: {
    shopifyHandle: '',
    shopifyProductId: 'gid://shopify/Product/12136700150024',
    shopifyVariantId: '',
    variants: [
      { size: 'S', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888632584' },
      { size: 'M', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888665352' },
      { size: 'L', gender: 'women', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888730888' },
      { size: 'M', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888698120' },
      { size: 'L', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888763656' },
      { size: 'XL', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888796424' },
      { size: '2XL', gender: 'men', shopifyProductId: 'gid://shopify/Product/12136700150024', shopifyVariantId: 'gid://shopify/ProductVariant/58318888829192' },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// APPAREL GROUPS — maps each standalone-garment Sets card to its Men's/Women's
// product ids (bundles are looked up directly in shopifySetsMapping instead,
// since each bundle is a single product with combined Gender+Size variants).
// ─────────────────────────────────────────────────────────────────────────────
export const apparelGroups: Record<string, { men: string; women: string }> = {
  poloShirt: { men: 'mensPolo', women: 'womensPolo' },
  tshirt: { men: 'mensTshirt', women: 'womensTshirt' },
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

/** Returns the Variant GID for a Sets bundle + size (+ gender) combination (apparel bundles only) */
export function getShopifySetVariantId(
  bundleId: string,
  size: string,
  gender?: 'men' | 'women',
): string | undefined {
  const bundle = shopifySetsMapping[bundleId];
  if (!bundle?.variants) return undefined;
  const variant = bundle.variants.find(v => v.size === size && (gender === undefined || v.gender === gender));
  return variant?.shopifyVariantId || undefined;
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
  const productsComplete = Object.values(shopifyProductMapping).every(product =>
    product.variants.every(variant => variant.shopifyVariantId !== ''),
  );
  const setsComplete = Object.values(shopifySetsMapping).every(set =>
    (set.variants ?? []).every(variant => variant.shopifyVariantId !== ''),
  );
  return productsComplete && setsComplete;
}

/** Returns all currently configured variant GIDs */
export function getConfiguredVariantIds(): string[] {
  const ids: string[] = [];
  Object.values(shopifyProductMapping).forEach(product => {
    product.variants.forEach(variant => {
      if (variant.shopifyVariantId) ids.push(variant.shopifyVariantId);
    });
  });
  Object.values(shopifySetsMapping).forEach(set => {
    (set.variants ?? []).forEach(variant => {
      if (variant.shopifyVariantId) ids.push(variant.shopifyVariantId);
    });
  });
  return ids;
}
