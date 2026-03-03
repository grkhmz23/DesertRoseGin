# Shopify Storefront API Integration

This document describes the Shopify Storefront API integration for the Desert Rose Gin website.

## Overview

The integration uses the Shopify Storefront API to:
- Create and manage carts on Shopify
- Sync cart items between the local app and Shopify
- Generate checkout URLs for customers to complete purchases

## Architecture

### Client-Side (Browser)
- **Shopify Client** (`client/src/lib/shopify/client.ts`) - Direct Storefront API calls using public access token
- **Cart Context** (`client/src/components/cart/cart-context.tsx`) - Manages cart state and syncs with Shopify
- **Product Mapping** (`client/src/lib/shopify/products.ts`) - Maps internal products to Shopify variants

### Server-Side (Node.js)
- **Shopify Client** (`server/shopify/client.ts`) - Storefront API calls using private access token
- **API Routes** (`server/shopify/routes.ts`) - REST endpoints for Shopify operations

## Configuration

### Environment Variables

Create a `.env` file in the `client/` directory:

```bash
# Shopify Store Configuration
VITE_SHOPIFY_STORE_DOMAIN=c33e14-5f.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=db89d59c536b757dc8ea8cd2208f4c05

# Legacy fallback (optional)
VITE_SHOPIFY_STORE_URL=https://c33e14-5f.myshopify.com/cart
```

For server-side operations, add to your environment:

```bash
SHOPIFY_STORE_URL=c33e14-5f.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=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
```

## Product Mapping

### Current Setup

Products are mapped in `client/src/lib/shopify/products.ts`:

```typescript
export const shopifyProductMapping = {
  classic: {
    id: 'classic',
    shopifyHandle: 'desert-rose-classic-edition',
    variants: [
      { size: "500ml Bottle", shopifyVariantId: "", sku: "DR-CLASSIC-500" },
      { size: "200ml Bottle", shopifyVariantId: "", sku: "DR-CLASSIC-200" },
      { size: "Gift Box Set", shopifyVariantId: "", sku: "DR-CLASSIC-BOX" },
    ]
  },
  limited: {
    id: 'limited',
    shopifyHandle: 'desert-rose-limited-edition',
    variants: [
      { size: "500ml Bottle", shopifyVariantId: "", sku: "DR-LIMITED-500" },
      { size: "Gift Box Set", shopifyVariantId: "", sku: "DR-LIMITED-BOX" },
    ]
  }
};
```

### Setting Up Product Variant IDs

To complete the integration, you need to add the Shopify variant IDs to the mapping:

1. **Go to Shopify Admin** > Products
2. **Find your products** (Desert Rose Classic Edition, Desert Rose Limited Edition)
3. **Get Variant IDs** - You can get these by:
   - Using the Shopify GraphQL API to query products
   - Looking at the variant URLs in Shopify Admin
   - Using the Bulk Editor to see variant IDs

4. **Update the mapping** in `client/src/lib/shopify/products.ts`:

```typescript
variants: [
  { 
    size: "500ml Bottle", 
    shopifyVariantId: "gid://shopify/ProductVariant/1234567890", // Add your ID
    sku: "DR-CLASSIC-500" 
  },
  // ... other variants
]
```

## How It Works

### Adding to Cart

1. User clicks "Order" button on a product
2. `handleAddToCart` is called with product details
3. Cart context checks for Shopify variant ID:
   - If found, uses it for the cart item ID
   - If not found, falls back to internal ID
4. Item is added to local state
5. Cart is synced with Shopify via `createCart` mutation
6. Shopify cart ID and checkout URL are stored in localStorage

### Checkout Flow

1. User clicks "Proceed to Checkout" in cart drawer
2. App opens the Shopify checkout URL in a new tab
3. Customer completes purchase on Shopify
4. Shopify handles payment, shipping, and order confirmation

### Cart Persistence

- Cart items are stored in `localStorage` as backup
- Shopify cart ID is stored in `localStorage` for recovery
- On page load, app tries to fetch existing Shopify cart
- If Shopify cart is expired/invalid, creates a new one

## API Endpoints

The server provides these REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shopify/products` | Get all products |
| GET | `/api/shopify/products/:handle` | Get product by handle |
| POST | `/api/shopify/cart` | Create a new cart |
| GET | `/api/shopify/cart/:cartId` | Get cart by ID |
| POST | `/api/shopify/cart/:cartId/lines` | Add items to cart |
| PUT | `/api/shopify/cart/:cartId/lines` | Update cart items |
| DELETE | `/api/shopify/cart/:cartId/lines` | Remove items from cart |

## Testing

### Test the Integration

1. **Set up environment variables** (see Configuration section)

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Add products to cart** - Visit the product pages and click "Order"

4. **Check the cart drawer** - Click the cart icon to see items

5. **Test checkout** - Click "Proceed to Checkout" to verify Shopify checkout URL

### Debugging

Enable debug logging in the browser console:

```javascript
// Check cart state
const cart = JSON.parse(localStorage.getItem('desert-rose-cart-v2'));
console.log('Cart items:', cart);

// Check Shopify cart ID
const cartId = localStorage.getItem('desert-rose-shopify-cart-id');
console.log('Shopify cart ID:', cartId);
```

## Security Notes

- **Public Access Token** (`db89d59c536b757dc8ea8cd2208f4c05`) is safe to expose in client-side code
- **Private Access Token** (`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`) should only be used server-side
- The Storefront API only allows read operations and cart management - no admin access
- Customer data is handled entirely by Shopify during checkout

## Next Steps

1. **Set up products in Shopify Admin** with correct handles and variants
2. **Update product mapping** with actual Shopify variant IDs
3. **Test the full flow** from add to cart to checkout
4. **Consider adding**:
   - Inventory checking before add to cart
   - Price sync from Shopify
   - Product image sync from Shopify
   - Real-time cart updates

## Troubleshooting

### Cart not syncing with Shopify
- Check browser console for API errors
- Verify `VITE_SHOPIFY_STOREFRONT_TOKEN` is set correctly
- Check network tab for failed GraphQL requests

### Checkout URL not working
- Verify products exist in Shopify with matching handles
- Check that variant IDs are correctly configured
- Ensure Shopify store is not password-protected

### Products not found
- Verify product handles in Shopify match the mapping
- Check that products are published and visible
- Ensure variants have inventory available
