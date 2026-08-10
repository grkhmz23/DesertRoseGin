/**
 * Cart line availability. Run with: npx tsx script/test-cart-line.ts
 *
 * Regression cover for the "0 items / CHF 0.00 subtotal with items visible"
 * cart: Shopify had zeroed every line's quantity and the UI showed each one as
 * a normal item sitting at quantity 0.
 */

import { isUnfulfillable } from '../client/src/lib/cart-line';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

check('a normal line is fulfillable', isUnfulfillable({ quantity: 2, availableForSale: true }), false);
check('quantity 1 is fulfillable', isUnfulfillable({ quantity: 1, availableForSale: true }), false);

// The reported bug: Shopify keeps the line but zeroes it.
check('a zeroed line is unfulfillable', isUnfulfillable({ quantity: 0, availableForSale: true }), true);
check('a sold-out line is unfulfillable', isUnfulfillable({ quantity: 1, availableForSale: false }), true);
check('zeroed and sold out is unfulfillable', isUnfulfillable({ quantity: 0, availableForSale: false }), true);

// A negative quantity should never reach the UI, but must not read as valid.
check('a negative quantity is unfulfillable', isUnfulfillable({ quantity: -1 }), true);

// Locally-built optimistic items carry no availability flag yet; absence of the
// flag must not by itself mark a real line unavailable.
check('a line with unknown availability is judged on quantity', isUnfulfillable({ quantity: 3 }), false);
check('an unknown-availability zeroed line is unfulfillable', isUnfulfillable({ quantity: 0 }), true);

console.log(failures === 0 ? '\nAll cart line checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
