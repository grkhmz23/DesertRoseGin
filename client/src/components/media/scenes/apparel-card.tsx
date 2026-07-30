import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, RotateCcw, ShoppingCart, Truck, ZoomIn } from 'lucide-react';
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
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setPreviewIndex(0);
  }, [gender]);

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
  const titleSuffix = t(`sets.bundles.${item.id}.titleSuffix`, { defaultValue: '' });
  const content = t(`sets.bundles.${item.id}.content`);
  const description = t(`sets.bundles.${item.id}.${gender}.description`, { defaultValue: '' });
  const features = t(`sets.bundles.${item.id}.${gender}.features`, { returnObjects: true, defaultValue: [] }) as string[];
  const care = t(`sets.bundles.${item.id}.${gender}.care`, { returnObjects: true, defaultValue: [] }) as string[];
  const closing = t(`sets.bundles.${item.id}.${gender}.closing`, { defaultValue: '' });
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

  const isEven = index % 2 === 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="group relative grid grid-cols-1 items-center gap-10 border-t border-[#F5EFE6]/10 py-14 first:border-t-0 lg:grid-cols-12 lg:grid-flow-dense lg:gap-14 lg:py-20"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setLightboxIndex(previewIndex)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setLightboxIndex(previewIndex);
            }
          }}
          aria-label={t('apparel.zoomLabel')}
          className={cn(
            'group/media relative z-10 aspect-[4/3] w-full cursor-pointer overflow-hidden lg:col-span-7',
            isEven ? 'lg:col-start-1' : 'lg:col-start-6',
          )}
        >
          <img
            src={images[previewIndex]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            draggable={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B1810]/15 to-[#120b08]/90" />
          {item.kind === 'bundle' ? (
            <span
              className="absolute left-4 top-4 border px-4 py-2 text-[9px] uppercase tracking-[0.32em] text-[#F5EFE6]"
              style={{ borderColor: `${item.accent}80`, backgroundColor: 'rgba(27,18,14,0.55)' }}
            >
              {t('sets.cardLabel')}
            </span>
          ) : null}
          <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-[#2B1810]/60 text-[#F5EFE6]/85 opacity-0 transition-opacity duration-300 group-hover/media:opacity-100">
            <ZoomIn size={14} strokeWidth={1.4} />
          </div>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewIndex((current) => (current - 1 + images.length) % images.length);
                }}
                aria-label={t('apparel.previousPhoto')}
                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-[#2B1810]/60 text-[#F5EFE6]/85 opacity-0 transition-opacity duration-300 group-hover/media:opacity-100"
              >
                <ChevronLeft size={16} strokeWidth={1.4} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setPreviewIndex((current) => (current + 1) % images.length);
                }}
                aria-label={t('apparel.nextPhoto')}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-[#2B1810]/60 text-[#F5EFE6]/85 opacity-0 transition-opacity duration-300 group-hover/media:opacity-100"
              >
                <ChevronRight size={16} strokeWidth={1.4} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover/media:opacity-100">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transition-colors',
                      i === previewIndex ? 'bg-[#F5EFE6]' : 'bg-[#F5EFE6]/40',
                    )}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div
          className={cn(
            'relative z-10 lg:col-span-5',
            isEven ? 'lg:col-start-8' : 'lg:col-start-1',
          )}
        >
          <h3 className="font-ergon-light leading-tight text-[#F5EFE6]">
            <span className="text-3xl sm:text-4xl lg:text-5xl">{title}</span>
            {titleSuffix ? (
              <span className="mt-2 block text-sm font-normal uppercase tracking-[0.14em] text-[#F5EFE6]/50 sm:text-base">
                {titleSuffix}
              </span>
            ) : null}
          </h3>
          <p className="mt-5 font-ergon-light text-xl text-[#D4A373]">{displayPrice}</p>

          {closing ? (
            <p className="mt-6 font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/78">{closing}</p>
          ) : (
            <>
              <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#D4A373]/90">
                {t('sets.includesLabel')}
              </p>
              <p className="mt-2 font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/78">{content}</p>
            </>
          )}

          <div className="mt-7 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]/48">
              {t('apparel.selectGenderPrompt')}
            </p>
            <div className="flex max-w-xs gap-1.5">
              {(['men', 'women'] as ApparelGender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderChange(g)}
                  className={cn(
                    'flex-1 border px-2 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-all duration-300',
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

          <div className="mt-5 space-y-2">
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
                    'h-12 min-w-[3rem] border px-2 text-[11px] uppercase tracking-[0.1em] transition-all duration-300',
                    size === s
                      ? 'border-[#D4A373] bg-[#D4A373]/10 text-[#D4A373]'
                      : 'border-[#F5EFE6]/20 text-[#F5EFE6]/60 hover:border-[#F5EFE6]/40',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p
              className={cn(
                'text-[10px] uppercase tracking-[0.12em] transition-opacity',
                size ? 'opacity-0' : 'text-[#F5EFE6]/40',
              )}
            >
              {t('apparel.selectSizePrompt')}
            </p>
          </div>

          {description || features.length > 0 || care.length > 0 ? (
            <div className="mt-7 border-t border-[#F5EFE6]/10">
              {description ? (
                <Expandable label={t('apparel.descriptionLabel')}>
                  <p className="text-xs leading-relaxed text-[#F5EFE6]/75">{description}</p>
                </Expandable>
              ) : null}
              {features.length > 0 ? (
                <Expandable label={t('apparel.featuresLabel')}>
                  <ol className="space-y-1.5">
                    {features.map((line, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-[#F5EFE6]/75">
                        <span className="shrink-0 tabular-nums text-[#D4A373]">{i + 1}.</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>
                </Expandable>
              ) : null}
              {care.length > 0 ? (
                <Expandable label={t('apparel.careLabel')}>
                  <ol className="space-y-1.5">
                    {care.map((line, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-[#F5EFE6]/75">
                        <span className="shrink-0 tabular-nums text-[#D4A373]">{i + 1}.</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>
                </Expandable>
              ) : null}
            </div>
          ) : null}

          <div className="mt-7 space-y-3 border-t border-[#F5EFE6]/10 pt-6">
            <div className="flex items-center gap-1.5 text-[#F5EFE6]/70">
              <RotateCcw size={11} className="text-[#D4A373]" />
              <span className="text-[9px] font-light uppercase tracking-[0.14em]">
                {t('apparel.returns.badge')}
              </span>
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
                'group/cta relative flex w-full max-w-md items-center justify-between overflow-hidden border border-[#D4A373] px-5 py-4 text-[#D4A373] transition-colors duration-500',
                'hover:text-[#1c1008]',
                !canAddToCart && 'pointer-events-none opacity-50',
              )}
            >
              <span className="relative z-10 text-xs font-light uppercase tracking-[0.3em]">
                {!isCH ? t('apparel.chOnly.ctaDisabled') : t('ui.product.addToCart')}
              </span>
              <ShoppingCart size={14} className="relative z-10" />
              <span className="absolute inset-0 origin-left scale-x-0 bg-[#D4A373] transition-transform duration-500 group-hover/cta:scale-x-100" />
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

function Expandable({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#F5EFE6]/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#F5EFE6]/85">{label}</span>
        <ChevronRight
          size={14}
          className={cn('shrink-0 text-[#D4A373] transition-transform duration-300', open && 'rotate-90')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
