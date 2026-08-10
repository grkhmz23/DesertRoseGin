/**
 * Shopify Storefront API Client (Browser)
 * Sends GraphQL operations through the same-origin serverless proxy so the
 * Storefront token is not embedded in the public Vite bundle.
 */

import type {
  ShopifyProduct,
  ShopifyCart,
  ShopifyCartLine
} from "../../../../shared/shopify-schema";
import { STORE_COUNTRY } from "../currency";

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "";

/**
 * Everything the app needs about a cart, shared by every cart query so the
 * shapes cannot drift apart.
 *
 * `availableForSale` and `quantityAvailable` matter: when merchandise cannot be
 * fulfilled (out of stock, or not sellable in the cart's market) Shopify keeps
 * the line but sets its quantity to 0 and returns no userErrors. Without these
 * fields the app cannot tell that apart from a real line and renders a silent
 * "0" with a CHF 0.00 subtotal.
 */
const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            product {
              title
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

class ShopifyClient {
  private storeDomain: string;

  constructor() {
    this.storeDomain = SHOPIFY_STORE_DOMAIN;
  }

  private async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch("/api/shopify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables, storeDomain: this.storeDomain }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
      const errorMessages = json.errors.map(e => e.message).join(", ");
      console.error("[ShopifyClient] GraphQL errors:", json.errors);
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    if (!json.data) {
      throw new Error("No data returned from Shopify");
    }

    return json.data;
  }

  // Create a new cart. Always in the Swiss market so cart totals and the
  // Shopify checkout are quoted in CHF, whatever country the buyer browses from.
  async createCart(
    lines?: Array<{ merchandiseId: string; quantity: number }>,
  ): Promise<ShopifyCart> {
    const query = `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart { ${CART_FIELDS} }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines: lines || [],
        buyerIdentity: { countryCode: STORE_COUNTRY },
      },
    };

    const data = await this.graphql<{ cartCreate: { cart: ShopifyCart; userErrors: any[] } }>(
      query, 
      variables
    );

    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation errors: ${JSON.stringify(data.cartCreate.userErrors)}`);
    }

    return data.cartCreate.cart;
  }

  // Get cart by ID
  async getCart(cartId: string): Promise<ShopifyCart | null> {
    const query = `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) { ${CART_FIELDS} }
      }
    `;

    const data = await this.graphql<{ cart: ShopifyCart | null }>(query, { cartId });
    return data.cart;
  }

  // Add lines to cart
  async addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphql<{ cartLinesAdd: { cart: ShopifyCart; userErrors: any[] } }>(
      query, 
      { cartId, lines }
    );

    if (data.cartLinesAdd.userErrors.length > 0) {
      throw new Error(`Add to cart errors: ${JSON.stringify(data.cartLinesAdd.userErrors)}`);
    }

    return data.cartLinesAdd.cart;
  }

  // Update cart lines
  async updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart { ${CART_FIELDS} }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphql<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: any[] } }>(
      query, 
      { cartId, lines }
    );

    if (data.cartLinesUpdate.userErrors.length > 0) {
      throw new Error(`Update cart errors: ${JSON.stringify(data.cartLinesUpdate.userErrors)}`);
    }

    return data.cartLinesUpdate.cart;
  }

  // Remove lines from cart
  async removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
    const query = `
      mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart { ${CART_FIELDS} }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await this.graphql<{ cartLinesRemove: { cart: ShopifyCart; userErrors: any[] } }>(
      query, 
      { cartId, lineIds }
    );

    if (data.cartLinesRemove.userErrors.length > 0) {
      throw new Error(`Remove from cart errors: ${JSON.stringify(data.cartLinesRemove.userErrors)}`);
    }

    return data.cartLinesRemove.cart;
  }

  // Fetch product by handle
  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const query = `
      query GetProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          title
          description
          descriptionHtml
          handle
          productType
          tags
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                sku
                quantityAvailable
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    const data = await this.graphql<{ product: ShopifyProduct | null }>(query, { handle });
    return data.product;
  }

  // Fetch prices for a list of variant IDs. Pinned to the Swiss market: the
  // store quotes in CHF only, so the visitor's country never enters the query.
  async getVariantPrices(
    variantIds: string[],
  ): Promise<Map<string, { amount: string; currencyCode: string }>> {
    const query = `
      query GetVariantPrices($ids: [ID!]!) @inContext(country: ${STORE_COUNTRY}) {
        nodes(ids: $ids) {
          ... on ProductVariant {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    const data = await this.graphql<{
      nodes: Array<{ id: string; price: { amount: string; currencyCode: string } } | null>;
    }>(query, { ids: variantIds });

    const map = new Map<string, { amount: string; currencyCode: string }>();
    for (const node of data.nodes) {
      if (node) map.set(node.id, node.price);
    }
    return map;
  }

  // Fetch products by handles (for our product mapping)
  async getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
    const products = await Promise.all(
      handles.map(handle => this.getProductByHandle(handle)),
    );
    return products.filter((p): p is ShopifyProduct => p !== null);
  }
}

// Export singleton instance
export const shopifyClient = new ShopifyClient();
