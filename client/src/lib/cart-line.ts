/**
 * Cart line health.
 *
 * Shopify does not raise an error when it cannot sell a line's merchandise.
 * `cartLinesAdd` / `cartCreate` return success with an empty `userErrors`, but
 * the line comes back with `quantity: 0`. Such a line contributes nothing to the
 * subtotal, so a cart full of them renders as "0 items / CHF 0.00" with no
 * explanation. Treat those lines as unavailable rather than as real items.
 */

export interface CartLineState {
  quantity: number;
  availableForSale?: boolean;
}

export function isUnfulfillable(line: CartLineState): boolean {
  return line.quantity < 1 || line.availableForSale === false;
}
