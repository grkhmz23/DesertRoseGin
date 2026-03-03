/**
 * Script to fetch Shopify product variant IDs
 * Run: node script/get-shopify-variants.mjs
 */

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'c33e14-5f.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || 'db89d59c536b757dc8ea8cd2208f4c05';

const query = `
  query GetProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchVariants() {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', JSON.stringify(json.errors, null, 2));
      return;
    }

    console.log('\n=== Shopify Products & Variants ===\n');
    
    const products = json.data.products.edges;
    
    products.forEach(({ node: product }) => {
      console.log(`Product: ${product.title}`);
      console.log(`Handle: ${product.handle}`);
      console.log(`Product ID: ${product.id}`);
      console.log('Variants:');
      
      product.variants.edges.forEach(({ node: variant }) => {
        console.log(`  - Variant Title: ${variant.title}`);
        console.log(`    SKU: ${variant.sku || 'N/A'}`);
        console.log(`    Price: ${variant.price.amount} ${variant.price.currencyCode}`);
        console.log(`    Variant ID: ${variant.id}`);
        console.log('');
      });
      console.log('----------------------------------------\n');
    });

  } catch (error) {
    console.error('Error fetching variants:', error);
  }
}

fetchVariants();
