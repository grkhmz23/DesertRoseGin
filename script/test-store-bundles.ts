/**
 * Shelf visibility for THE SETS. Run with: npx tsx script/test-store-bundles.ts
 *
 * The cart refuses any id that is not a Shopify variant GID and shows the
 * customer an "unavailable" toast. A set whose Shopify product has not been
 * created yet must therefore stay off the shelf entirely — copy and pricing can
 * land first, but the card only appears once it can actually be bought.
 */

import { isSetPurchasable, shopifySetsMapping } from '../client/src/lib/shopify/products';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

check('a set with a variant id is purchasable', isSetPurchasable('discoveryKit'), true);
check('a set with a blank variant id is not', isSetPurchasable('twinPack'), false);
check('the aperitivo box is not sellable yet', isSetPurchasable('aperitivoBox'), false);
check('an unknown set id is not purchasable', isSetPurchasable('nope'), false);

// Every purchasable set must carry a real GID, never a placeholder string.
const badId = Object.entries(shopifySetsMapping).find(
  ([id, set]) =>
    isSetPurchasable(id) && !set.shopifyVariantId.startsWith('gid://shopify/ProductVariant/'),
);
check('every shelved set has a real variant GID', badId?.[0], undefined);

console.log(failures === 0 ? '\nAll store bundle checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
