import { useQuery } from '@tanstack/react-query';
import { shopifyClient } from '@/lib/shopify/client';
import { formatPriceEntry } from '@/lib/currency';

export type PriceMap = Map<string, { amount: string; currencyCode: string }>;

/**
 * Live Shopify prices for a set of variants. Prices are the same CHF figures
 * everywhere, so this does not wait on geo detection and is not keyed by country.
 */
export function useMarketPrices(variantIds: string[]) {
  return useQuery<PriceMap>({
    queryKey: ['variant-prices', variantIds],
    queryFn: () => shopifyClient.getVariantPrices(variantIds),
    enabled: variantIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function formatMarketPrice(
  priceMap: PriceMap | undefined,
  variantId: string,
  fallback: string,
): string {
  return formatPriceEntry(priceMap?.get(variantId), fallback);
}
