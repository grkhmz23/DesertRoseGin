import { useQuery } from '@tanstack/react-query';
import { shopifyClient } from '@/lib/shopify/client';
import { useMarket } from '@/components/market/market-context';

export type PriceMap = Map<string, { amount: string; currencyCode: string }>;

export function useMarketPrices(variantIds: string[]) {
  const { country, ready } = useMarket();

  return useQuery<PriceMap>({
    queryKey: ['market-prices', country, variantIds],
    queryFn: () => shopifyClient.getVariantPrices(variantIds, country),
    enabled: ready && variantIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function formatMarketPrice(
  priceMap: PriceMap | undefined,
  variantId: string,
  fallback: string,
): string {
  const entry = priceMap?.get(variantId);
  if (!entry) return fallback;

  const amount = parseFloat(entry.amount);
  const symbol = entry.currencyCode === 'EUR' ? '€' : 'CHF';

  const formatted = new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${symbol} ${formatted}`;
}
