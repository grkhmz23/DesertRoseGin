/**
 * Currency rules for the storefront. Run with: npx tsx script/test-currency.ts
 *
 * Desert Rose Gin quotes every price in CHF. These cases lock that in so a
 * foreign-currency response from Shopify can never reach a customer — neither
 * with a foreign symbol nor, worse, wearing a "CHF" label.
 */

import {
  formatCHF,
  formatPriceEntry,
  isStoreCurrency,
  priceEntryAmount,
  STORE_CURRENCY,
} from '../client/src/lib/currency';

let failures = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`        expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const FALLBACK = 'CHF 48.80';

check('store currency is CHF', STORE_CURRENCY, 'CHF');

check('formatCHF renders a CHF label', formatCHF(48.8), 'CHF 48.80');
check('formatCHF always shows two decimals', formatCHF(25), 'CHF 25.00');

check('isStoreCurrency accepts CHF', isStoreCurrency('CHF'), true);
check('isStoreCurrency rejects EUR', isStoreCurrency('EUR'), false);
check('isStoreCurrency rejects undefined', isStoreCurrency(undefined), false);

check(
  'a CHF price from Shopify is displayed',
  formatPriceEntry({ amount: '52.00', currencyCode: 'CHF' }, FALLBACK),
  'CHF 52.00',
);

check(
  'a missing price falls back to the static CHF copy',
  formatPriceEntry(undefined, FALLBACK),
  FALLBACK,
);

// Regression: a EUR amount used to render as "€ 52.00" on EU traffic.
check(
  'a EUR price is never shown — falls back to the CHF copy',
  formatPriceEntry({ amount: '52.00', currencyCode: 'EUR' }, FALLBACK),
  FALLBACK,
);

// Regression: the old `currencyCode === 'EUR' ? '€' : 'CHF'` ternary printed a
// USD amount under a CHF label, which reads as a correct Swiss price.
check(
  'a USD price is never relabelled as CHF',
  formatPriceEntry({ amount: '61.00', currencyCode: 'USD' }, FALLBACK),
  FALLBACK,
);

check(
  'an unparseable amount falls back rather than rendering NaN',
  formatPriceEntry({ amount: '', currencyCode: 'CHF' }, FALLBACK),
  FALLBACK,
);

// The numeric amount feeds cart lines and analytics, so it needs the same guard
// as the display path — a EUR amount must not be booked as a CHF value.
check('a CHF amount is used', priceEntryAmount({ amount: '52.00', currencyCode: 'CHF' }, 48.8), 52);
check('a EUR amount is discarded', priceEntryAmount({ amount: '52.00', currencyCode: 'EUR' }, 48.8), 48.8);
check('a USD amount is discarded', priceEntryAmount({ amount: '61.00', currencyCode: 'USD' }, 48.8), 48.8);
check('a missing amount falls back', priceEntryAmount(undefined, 48.8), 48.8);
check('an unparseable amount falls back', priceEntryAmount({ amount: 'x', currencyCode: 'CHF' }, 48.8), 48.8);

console.log(failures === 0 ? '\nAll currency checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
