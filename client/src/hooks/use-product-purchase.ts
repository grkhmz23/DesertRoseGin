import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/components/cart';
import { getShopifyVariantId } from '@/lib/shopify/products';
import { trackAddToCart } from '@/lib/analytics';
import { useMarket } from '@/components/market/market-context';
import { useMarketPrices, formatMarketPrice } from '@/hooks/use-market-prices';
import { formatCHF, isStoreCurrency } from '@/lib/currency';
import type { ProductData, ProductOption } from '@/components/media/scenes/product-scene';

/**
 * Buy-flow state for a gin edition: variant resolution, live market pricing,
 * quantity and add-to-cart.
 *
 * Extracted from ProductScene so THE STORE's GIN shelf can offer the same
 * purchase flow inline without a second copy of this logic. The pricing rules
 * here are easy to get subtly wrong (discounted 2x variants, locale-formatted
 * price strings), and two drifting copies would mean two different totals for
 * the same bottle depending on which page the customer bought it from.
 */
export function useProductPurchase(data: ProductData) {
  const { t } = useTranslation('common');
  const [selectedOption, setSelectedOption] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem, isLoading } = useCart();
  const { currency } = useMarket();

  // Collect all variant IDs including 2x counterparts so live prices are available for both
  const variantIds = data.options.flatMap(o => {
    const ids: string[] = [];
    const id1 = o.shopifyVariantId || (o.shopifyLookupSize ? getShopifyVariantId(data.id, o.shopifyLookupSize) : undefined);
    if (id1) ids.push(id1);
    if (o.qty2LookupSize) {
      const id2 = getShopifyVariantId(data.id, o.qty2LookupSize);
      if (id2) ids.push(id2);
    }
    return ids;
  });

  const { data: priceMap } = useMarketPrices(variantIds);

  const purchaseOptions = data.options;
  const selectedPurchase = purchaseOptions[selectedOption];

  const selectedVariantId = selectedPurchase.shopifyVariantId ||
    (selectedPurchase.shopifyLookupSize ? getShopifyVariantId(data.id, selectedPurchase.shopifyLookupSize) : undefined);
  const qty2VariantId = selectedPurchase.qty2LookupSize
    ? getShopifyVariantId(data.id, selectedPurchase.qty2LookupSize)
    : undefined;

  // Debug: warn when a Shopify variant ID cannot be resolved
  if (!selectedVariantId && selectedPurchase.shopifyLookupSize) {
    console.warn(
      `[useProductPurchase] Could not resolve Shopify variant ID for product "${data.id}" with lookup size "${selectedPurchase.shopifyLookupSize}"`,
    );
  }

  // When qty=2 and a discounted 2x variant exists, route through it (1 unit of 2x = discounted price)
  const effectiveVariantId = qty === 2 && qty2VariantId ? qty2VariantId : selectedVariantId;
  const effectiveQty = qty === 2 && qty2VariantId ? 1 : qty;

  const computeDisplayPrice = (): string => {
    if (qty === 2 && qty2VariantId) {
      return formatMarketPrice(priceMap, qty2VariantId, selectedPurchase.price);
    }
    if (qty === 1 || !selectedVariantId) {
      const raw = formatMarketPrice(priceMap, selectedVariantId ?? '', selectedPurchase.price);
      return raw.replace(' (IVA incl.)', '');
    }
    // qty > 1 without a 2x variant: multiply unit price
    const entry = priceMap?.get(selectedVariantId);
    if (entry && isStoreCurrency(entry.currencyCode)) {
      const total = parseFloat(entry.amount) * qty;
      if (Number.isFinite(total)) return formatCHF(total);
    }
    // Fallback: parse the string price and multiply
    const priceStr = selectedPurchase.price.replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    const base = parseFloat(priceStr);
    if (!isNaN(base)) {
      return formatCHF(base * qty);
    }
    return selectedPurchase.price.replace(' (IVA incl.)', '');
  };

  const handleAddToCart = async () => {
    const livePriceStr = effectiveVariantId
      ? formatMarketPrice(priceMap, effectiveVariantId, selectedPurchase.price)
      : selectedPurchase.price;
    const priceString = livePriceStr
      .replace(/[^0-9,.-]/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');
    const price = parseFloat(priceString);

    if (isNaN(price)) {
      console.error('Invalid price format:', selectedPurchase.price);
      return;
    }

    if (!effectiveVariantId) {
      console.warn('No Shopify variant ID found for:', data.id, selectedPurchase.shopifyLookupSize);
    }

    trackAddToCart({
      content_ids: [effectiveVariantId || data.id],
      content_type: 'product',
      content_name: data.name,
      currency,
      value: price,
    });

    await addItem({
      id: effectiveVariantId || `${data.id}-${selectedPurchase.shopifyLookupSize || selectedPurchase.size}`,
      name: data.name,
      variant: selectedPurchase.size,
      price,
      image: selectedPurchase.image,
      handle: data.shopifyHandle || data.id,
    }, effectiveQty);
  };

  const selectPurchase = (index: number) => {
    setSelectedOption(index);
    setQty(1);
  };

  const optionPrice = (purchaseOption: ProductOption): string => {
    const optionVariantId = purchaseOption.shopifyVariantId ||
      (purchaseOption.shopifyLookupSize ? getShopifyVariantId(data.id, purchaseOption.shopifyLookupSize) : undefined);

    return formatMarketPrice(priceMap, optionVariantId ?? '', purchaseOption.price.replace(' (IVA incl.)', ''));
  };

  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';

  return {
    selectedOption,
    selectPurchase,
    qty,
    setQty,
    purchaseOptions,
    selectedPurchase,
    isLoading,
    handleAddToCart,
    optionPrice,
    displayPrice: computeDisplayPrice(),
    productName: t(`${productKey}.name`),
    productDescription: t(`${productKey}.description`),
    isBoxSelection: !!selectedPurchase?.isBox,
    isBookletSelection: selectedPurchase?.shopifyLookupSize === 'Cocktail Booklet',
    isWideSelection: !!selectedPurchase?.isWide,
  };
}
