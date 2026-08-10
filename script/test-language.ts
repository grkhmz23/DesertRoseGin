/**
 * Location → language rules. Run with: npx tsx script/test-language.ts
 *
 * Visitors get their country's language automatically; a manual pick in the
 * language switcher wins and must survive a reload.
 */

import { getLanguageFromCountry } from '../client/src/lib/language';

let failures = 0;

function check(country: string, expected: string) {
  const actual = getLanguageFromCountry(country);
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${country} -> ${expected}${ok ? '' : ` (got ${actual})`}`);
}

// The cases the storefront is judged on.
check('FR', 'fr');
check('DE', 'de');
check('IT', 'it');
check('ES', 'es');
check('AE', 'ar');
check('GB', 'en');
check('US', 'en');

// Switzerland is the home market and is listed as both German- and
// French-speaking; German is checked first, matching the majority.
check('CH', 'de');

// Lowercase headers must still resolve.
check('fr', 'fr');

// Unknown or missing country falls back to English rather than throwing.
check('ZZ', 'en');
check('', 'en');

// Regional spread beyond the headline markets.
check('AT', 'de');
check('BE', 'fr');
check('MX', 'es');
check('MA', 'ar');
check('SM', 'it');

console.log(failures === 0 ? '\nAll language checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
