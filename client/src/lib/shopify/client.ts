/**
 * Shopify Storefront API Client (Browser)
 * Client-side client using public access token
 */

import type { 
  ShopifyProduct, 
  ShopifyCart, 
  ShopifyCartLine 
} from "../../../../shared/shopify-schema";

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "c33e14-5f.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "";

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
  private accessToken: string;

  constructor() {
    this.storeDomain = SHOPIFY_STORE_DOMAIN;
    this.accessToken = SHOPIFY_STOREFRONT_TOKEN;
  }

  private async graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const endpoint = `https://${this.storeDomain}/api/2024-01/graphql.json`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
      const errorMessages = json.errors.map(e => e.message).join(", ");
      throw new Error(`GraphQL errors: ${errorMessages}`);
    }

    if (!json.data) {
      throw new Error("No data returned from Shopify");
    }

    return json.data;
  }

  // Create a new cart
  async createCart(lines?: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart> {
    const query = `
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
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
          }
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
        cart(id: $cartId) {
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
        }
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
          cart {
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
            }
          }
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
          cart {
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
            }
          }
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
          cart {
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
            }
          }
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

  // Fetch products by handles (for our product mapping)
  async getProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
    const query = `
      query GetProductsByHandles($handles: [String!]!) {
        nodes(handles: $handles) {
          ... on Product {
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
      }
    `;

    const data = await this.graphql<{ nodes: (ShopifyProduct | null)[] }>(query, { handles });
    return data.nodes.filter((p): p is ShopifyProduct => p !== null);
  }
}

// Export singleton instance
export const shopifyClient = new ShopifyClient();
