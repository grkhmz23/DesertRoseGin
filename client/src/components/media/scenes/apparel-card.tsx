import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { RotateCcw, ShoppingCart, Truck, ZoomIn } from 'lucide-react';
import { useCart } from '@/components/cart';
import {
  apparelGroups,
  getShopifySetVariantId,
  getShopifyVariantId,
  shopifyProductMapping,
  shopifySetsMapping,
} from '@/lib/shopify/products';
import { trackAddToCart } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useMarket } from '@/components/market/market-context';
import { useMarketPrices, formatMarketPrice } from '@/hooks/use-market-prices';
import { Lightbox } from '@/components/media/lightbox';

export type ApparelGender = 'men' | 'women';

export interface ApparelItem {
  /** Key into apparelGroups (also the sets.bundles.<id> i18n namespace) */
  id: string;
  kind: 'product' | 'bundle';
  price: number;
  accent: string;
  /** Gallery images per gender (main photo first, used as the card thumbnail) */
  images: Record<ApparelGender, string[]>;
}

interface ApparelCardProps {
  item: ApparelItem;
  index: number;
  isActive: boolean;
}

export function ApparelCard({ item, index, isActive }: ApparelCardProps) {
  const { t } = useTranslation('common');
  const { addItem, isLoading } = useCart();
  const { country, ready, currency } = useMarket();
  const [gender, setGender] = useState<ApparelGender>('men');
  const [size, setSize] = useState<string | undefined>(undefined);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isCH = !ready || country === 'CH';
  // Standalone garments are separate Men's/Women's products (apparelGroups lookup).
  // Bundles are a single Shopify product with combined Gender+Size variants,
  // looked up directly by item.id and filtered by the selected gender.
  const genderProductId = item.kind === 'product' ? apparelGroups[item.id]?.[gender] : undefined;

  const sizeOptions = useMemo(() => {
    if (item.kind === 'bundle') {
      return (shopifySetsMapping[item.id]?.variants ?? [])
        .filter((v) => v.gender === gender)
        .map((v) => v.size);
    }
    if (!genderProductId) return [];
    return shopifyProductMapping[genderProductId]?.variants.map((v) => v.size) ?? [];
  }, [gender, genderProductId, item.id, item.kind]);

  const resolveVariantId = (targetSize: string | undefined): string | undefined => {
    if (!targetSize) return undefined;
    if (item.kind === 'bundle') {
      return getShopifySetVariantId(item.id, targetSize, gender);
    }
    return genderProductId ? getShopifyVariantId(genderProductId, targetSize) : undefined;
  };

  const variantIds = useMemo(() => {
    return sizeOptions.map((s) => resolveVariantId(s)).filter((v): v is string => Boolean(v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeOptions, gender, genderProductId, item.id, item.kind]);

  const { data: priceMap } = useMarketPrices(variantIds);

  const resolvedVariantId = resolveVariantId(size);

  const title = t(`sets.bundles.${item.id}.title`);
  const content = t(`sets.bundles.${item.id}.content`);
  const basePrice = `CHF ${item.price.toFixed(2)}`;
  const displayPrice = resolvedVariantId
    ? formatMarketPrice(priceMap, resolvedVariantId, basePrice)
    : basePrice;

  const images = item.images[gender];
  const canAddToCart = Boolean(resolvedVariantId) && isCH && !isLoading;

  const handleGenderChange = (nextGender: ApparelGender) => {
    setGender(nextGender);
    setSize(undefined);
  };

  const handleAddToCart = async () => {
    if (!resolvedVariantId) return;

    const genderLabel = t(`apparel.gender.${gender}`);
    const variantLabel = `${genderLabel} — ${size}`;
    const liveEntry = priceMap?.get(resolvedVariantId);
    const livePrice = liveEntry ? parseFloat(liveEntry.amount) : item.price;
    const handle =
      item.kind === 'bundle'
        ? shopifySetsMapping[item.id]?.shopifyHandle
        : genderProductId
          ? shopifyProductMapping[genderProductId]?.shopifyHandle
          : undefined;

    trackAddToCart({
      content_ids: [resolvedVariantId],
      content_type: 'product',
      content_name: title,
      currency,
      value: livePrice,
    });

    await addItem({
      id: resolvedVariantId,
      name: title,
      variant: variantLabel,
      price: livePrice,
      image: images[0],
      handle: handle || item.id,
    });
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 28 }}
        transition={{ duration: 0.65, delay: 0.18 + index * 0.08 }}
        className="group overflow-hidden border border-[#F5EFE6]/10 bg-[#1B120E]/70 backdrop-blur-sm flex flex-col"
      >
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative h-64 w-full overflow-hidden sm:h-72"
          aria-label={t('apparel.zoomLabel')}
        >
          <img
            src={images[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            draggable={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B1810]/15 to-[#120b08]/90" />
          <div
            className="absolute left-4 top-4 h-[2px] w-12"
            style={{ backgroundColor: item.accent }}
          />
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-[#2B1810]/60 text-[#F5EFE6]/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn size={14} strokeWidth={1.4} />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-left">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#F5EFE6]/55">
                {t('sets.cardLabel')}
              </p>
              <h3 className="mt-2 font-ergon-light text-xl leading-tight text-[#F5EFE6] sm:text-2xl">
                {title}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#F5EFE6]/45">
                {t('sets.priceLabel')}
              </p>
              <p className="mt-1 font-ergon-light text-xl text-[#D4A373]">{displayPrice}</p>
            </div>
          </div>
        </button>

        <div className="space-y-4 p-5 flex flex-col flex-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4A373]/90">
            {t('sets.includesLabel')}
          </p>
          <p className="font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/78">{content}</p>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]/48">
              {t('apparel.selectGenderPrompt')}
            </p>
            <div className="flex gap-1.5">
              {(['men', 'women'] as ApparelGender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={cn(
                    'flex-1 border px-2 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-300',
                    gender === g
                      ? 'border-[#D4A373] bg-[#D4A373]/10 text-[#D4A373]'
                      : 'border-[#F5EFE6]/20 text-[#F5EFE6]/60 hover:border-[#F5EFE6]/40',
                  )}
                >
                  {t(`apparel.gender.${g}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]/48">
              {t('apparel.sizeLabel')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    'min-w-[2.75rem] border px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-all duration-300',
                    size === s
                      ? 'border-[#D4A373] bg-[#D4A373]/10 text-[#D4A373]'
                      : 'border-[#F5EFE6]/20 text-[#F5EFE6]/60 hover:border-[#F5EFE6]/40',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {!size ? (
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#F5EFE6]/40">
                {t('apparel.selectSizePrompt')}
              </p>
            ) : null}
          </div>

          <div className="border-t border-[#F5EFE6]/10 pt-4 space-y-3 mt-auto">
            <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
              <div className="flex items-center gap-1.5 text-[#F5EFE6]/70">
                <RotateCcw size={11} className="text-[#D4A373]" />
                <span className="text-[9px] font-light uppercase tracking-[0.14em]">
                  {t('apparel.returns.badge')}
                </span>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-[0.16em] text-[#F5EFE6]/48">
              {t('ui.product.shippingNote')}
            </p>

            {!isCH ? (
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#F5EFE6]/50">
                {t('apparel.chOnly.notice')}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3 transition-colors duration-300',
                'bg-[#F3EFE7] text-[#0D0B0A] hover:bg-[#D4A373]',
                !canAddToCart && 'opacity-60 cursor-not-allowed',
              )}
            >
              <span className="text-xs font-light uppercase tracking-[0.22em]">
                {!isCH ? t('apparel.chOnly.ctaDisabled') : t('ui.product.addToCart')}
              </span>
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </motion.article>

      {lightboxIndex !== null ? (
        <Lightbox
          images={images}
          index={lightboxIndex}
          alt={title}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </>
  );
}
