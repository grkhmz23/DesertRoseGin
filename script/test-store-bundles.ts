/**
 * Shelf visibility for THE SETS. Run with: npx tsx script/test-store-bundles.ts
 *
 * The cart refuses any id that is not a Shopify variant GID and shows the
 * customer an "unavailable" toast. A set whose Shopify product has not been
 * created yet must therefore stay off the shelf entirely — copy and pricing can
 * land first, but the card only appears once it can actually be bought.
 *
 * A card that is on the shelf also needs its photograph: the bundle images are
 * plain /public paths, so nothing at build time notices a missing file and the
 * customer would get a broken image on a live product.
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { isSetPurchasable, shopifySetsMapping } from '../client/src/lib/shopify/products';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

check('a set with a variant id is purchasable', isSetPurchasable('discoveryKit'), true);
check('the twin pack is sellable', isSetPurchasable('twinPack'), true);
check('the aperitivo box is sellable', isSetPurchasable('aperitivoBox'), true);
check('an unknown set id is not purchasable', isSetPurchasable('nope'), false);

// Every purchasable set must carry a real GID, never a placeholder string.
const badId = Object.entries(shopifySetsMapping).find(
  ([id, set]) =>
    isSetPurchasable(id) && !set.shopifyVariantId.startsWith('gid://shopify/ProductVariant/'),
);
check('every shelved set has a real variant GID', badId?.[0], undefined);

// Public-path images used by BUNDLES in store-scene.tsx. Imported assets are
// checked by the bundler; these are not, so they are checked here.
const SET_IMAGES: Record<string, string> = {
  discoveryKit: 'client/public/discovery-kit.webp',
  signatureDuo: 'client/public/signature-duo.webp',
  twinPack: 'client/public/twin-pack.webp',
  aperitivoBox: 'client/public/aperitivo-box.webp',
};

for (const [id, file] of Object.entries(SET_IMAGES)) {
  if (!isSetPurchasable(id)) continue;
  check(`${id} has its photograph`, existsSync(resolve(file)), true);
}

console.log(failures === 0 ? '\nAll store bundle checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
