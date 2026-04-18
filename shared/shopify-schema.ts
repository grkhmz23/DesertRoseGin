/**
 * Shopify Storefront API Types and Schemas
 * Shared between client and server
 */

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  availableForSale: boolean;
  sku: string | null;
  image: ShopifyImage | null;
  quantityAvailable: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  productType: string;
  tags: string[];
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyProductVariant;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
}

// Cart item for our app
export interface CartItem {
  id: string;           // Shopify variant ID
  cartLineId?: string;  // Shopify cart line ID (if in Shopify cart)
  name: string;
  variant: string;
  price: number;
  currencyCode?: string;
  quantity: number;
  image: string;
  handle?: string;      // Product handle for Shopify
}

// Product mapping for our app
export interface ProductMapping {
  id: string;           // Our internal ID (classic, limited)
  shopifyProductId?: string;
  handle?: string;
  variants: Array<{
    size: string;
    shopifyVariantId: string;
    sku?: string;
  }>;
}
