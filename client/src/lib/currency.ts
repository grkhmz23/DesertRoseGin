/**
 * Store currency.
 *
 * Desert Rose Gin sells in Swiss francs only. Prices are quoted, carted and
 * checked out in CHF regardless of where the visitor is browsing from, so
 * nothing here keys off the visitor's country.
 */

export const STORE_COUNTRY = 'CH';
export const STORE_CURRENCY = 'CHF';

export type PriceEntry = { amount: string; currencyCode: string };

/** True when Shopify returned a price in the store currency. */
export function isStoreCurrency(currencyCode: string | undefined): boolean {
  return currencyCode === STORE_CURRENCY;
}

/** Render an amount as `CHF 48.80` using Swiss number formatting. */
export function formatCHF(amount: number): string {
  const formatted = new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${STORE_CURRENCY} ${formatted}`;
}

/**
 * Format a live Shopify price, falling back to the static CHF copy when the
 * live price is missing, unparseable, or came back in another currency.
 *
 * Queries are pinned to the Swiss market, so a non-CHF response means the
 * context was lost somewhere. Showing the static price is the safe outcome —
 * relabelling a foreign amount as CHF would quote the wrong number.
 */
export function formatPriceEntry(entry: PriceEntry | undefined, fallback: string): string {
  if (!entry || !isStoreCurrency(entry.currencyCode)) return fallback;

  const amount = parseFloat(entry.amount);
  if (!Number.isFinite(amount)) return fallback;

  return formatCHF(amount);
}

/**
 * Numeric CHF amount from a live price, for cart lines and analytics. Same
 * guard as formatPriceEntry: a non-CHF amount is discarded, not passed through.
 */
export function priceEntryAmount(entry: PriceEntry | undefined, fallback: number): number {
  if (!entry || !isStoreCurrency(entry.currencyCode)) return fallback;

  const amount = parseFloat(entry.amount);
  return Number.isFinite(amount) ? amount : fallback;
}
