import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart';
import { shopifySetsMapping } from '@/lib/shopify/products';
import { trackAddToCart } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { BrandFooter } from '@/components/layout/brand-footer';
import { useMarket } from '@/components/market/market-context';
import { useMarketPrices, formatMarketPrice } from '@/hooks/use-market-prices';
import { formatCHF, priceEntryAmount } from '@/lib/currency';
import { ApparelCard, type ApparelItem } from '@/components/media/scenes/apparel-card';
import { useGinEditions } from '@/hooks/use-gin-editions';
import { useProductPurchase } from '@/hooks/use-product-purchase';
import { STORE_CATEGORIES, type StoreCategory } from '@/components/gallery/page-data';
import type { ProductData } from '@/components/media/scenes/product-scene';

import poloMensFlat from '@assets/products/apparel/polo-mens-flat.webp';
import poloMensCollar from '@assets/products/apparel/polo-mens-collar-detail.webp';
import poloWomensFlat from '@assets/products/apparel/polo-womens-flat.webp';
import poloWomensCollar from '@assets/products/apparel/polo-womens-collar-detail.webp';
import tshirtMensFlat from '@assets/products/apparel/tshirt-mens-flat.webp';
import tshirtMensCollar from '@assets/products/apparel/tshirt-mens-collar-detail.webp';
import tshirtWomensFlat from '@assets/products/apparel/tshirt-womens-flat.webp';
import tshirtWomensCollar from '@assets/products/apparel/tshirt-womens-collar-detail.webp';
import logoEmbroideryMacro from '@assets/products/apparel/logo-embroidery-macro.webp';
import bundlePoloImage from '@assets/products/apparel/bundle-polo-classic-limited.webp';
import bundleTshirtImage from '@assets/products/apparel/bundle-tshirt-classic-limited.webp';
import giftBoxImage from '@assets/products/desert-rose-gift-box.webp';
import desertSelectionBoxScene from '@assets/products/desert-selection-box-scene.webp';
import bottleClassic from '@assets/products/classic-500-normalized.webp';
import bottleLimited from '@assets/products/limited-500-normalized.webp';

interface StoreSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
  /** null renders the category chooser; a category renders that shelf. */
  category: StoreCategory | null;
  onSelectCategory: (category: StoreCategory) => void;
  onReturnToStore: () => void;
}

type SetBundle = {
  id: string;
  image: string;
  accent: string;
  price: number;
};

const BUNDLES: SetBundle[] = [
  {
    id: 'discoveryKit',
    image: '/discovery-kit.webp',
    accent: '#E8DCCA',
    price: 76,
  },
  {
    id: 'signatureDuo',
    image: '/signature-duo.webp',
    accent: '#CD7E31',
    price: 92,
  },
  {
    id: 'desertSpringBox',
    image: desertSelectionBoxScene,
    accent: '#D4A373',
    price: 114,
  },
  {
    id: 'partyBox10',
    image: giftBoxImage,
    accent: '#A86A3D',
    price: 95,
  },
  {
    id: 'partyBox20',
    image: giftBoxImage,
    accent: '#8F5B36',
    price: 180,
  },
];

const APPAREL_ITEMS: ApparelItem[] = [
  {
    id: 'poloShirt',
    kind: 'product',
    price: 33,
    accent: '#D4A373',
    images: {
      men: [poloMensFlat, poloMensCollar, logoEmbroideryMacro],
      women: [poloWomensFlat, poloWomensCollar, logoEmbroideryMacro],
    },
  },
  {
    id: 'tshirt',
    kind: 'product',
    price: 25,
    accent: '#CD7E31',
    images: {
      men: [tshirtMensFlat, tshirtMensCollar, logoEmbroideryMacro],
      women: [tshirtWomensFlat, tshirtWomensCollar, logoEmbroideryMacro],
    },
  },
  {
    id: 'poloBundle',
    kind: 'bundle',
    price: 48.5,
    accent: '#A86A3D',
    images: {
      men: [bundlePoloImage, poloMensCollar, logoEmbroideryMacro],
      women: [bundlePoloImage, poloWomensCollar, logoEmbroideryMacro],
    },
  },
  {
    id: 'tshirtBundle',
    kind: 'bundle',
    price: 40.5,
    accent: '#8F5B36',
    images: {
      men: [bundleTshirtImage, tshirtMensCollar, logoEmbroideryMacro],
      women: [bundleTshirtImage, tshirtWomensCollar, logoEmbroideryMacro],
    },
  },
];

const CATEGORY_COVERS: Record<StoreCategory, string> = {
  gin: '/thestore-gin.webp',
  sets: desertSelectionBoxScene,
  merch: '/thestore-merch.webp',
};

const CATEGORY_ACCENTS: Record<StoreCategory, string> = {
  gin: '#D4A373',
  sets: '#CD7E31',
  merch: '#A86A3D',
};

const CATEGORY_COUNTS: Record<StoreCategory, number> = {
  gin: 2,
  sets: BUNDLES.length,
  merch: APPAREL_ITEMS.length,
};

export function StoreScene({
  isActive,
  onScrollPositionChange,
  category,
  onSelectCategory,
  onReturnToStore,
}: StoreSceneProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  return (
    <motion.div
      className="absolute inset-0 bg-[#2B1810] scene-scrollable"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6b3b21_0%,#2B1810_45%,#160d09_100%)]" />
        <div className="absolute left-[-8%] top-[8%] h-[40vw] w-[40vw] rounded-full bg-[#CD7E31]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[46vw] w-[46vw] rounded-full bg-[#E8DCCA]/6 blur-[140px]" />
      </div>

      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth-container">
        <section className="relative flex flex-col justify-center px-5 pb-10 pt-28 sm:px-8 md:px-10 lg:px-14 lg:pt-32">
          <motion.div
            key={category ?? 'hub'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {category ? (
              <button
                type="button"
                onClick={onReturnToStore}
                className="mb-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#F5EFE6]/55 transition-colors duration-300 hover:text-[#D4A373]"
              >
                <ArrowLeft size={12} />
                {t('store.backToStore')}
              </button>
            ) : null}

            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] text-[#D4A373]">
              <span className="h-px w-10 bg-[#D4A373]" />
              {/* Inside a shelf the eyebrow names the parent, so the heading can be just "GIN". */}
              {category ? t('store.title') : t('store.subtitle')}
            </div>
            <h1 className="mt-8 font-ergon-light text-[15vw] uppercase leading-[0.92] text-[#F5EFE6] sm:text-[12vw] md:text-[9vw] lg:text-[7.5rem]">
              {category ? t(`store.categories.${category}.title`) : t('store.title')}
            </h1>
            <p className="mt-8 max-w-lg font-ergon-light text-sm leading-loose text-[#F5EFE6]/65 md:text-base">
              {category ? t(`store.categories.${category}.description`) : t('store.description')}
            </p>
          </motion.div>
        </section>

        {/*
          AltimeterNavGallery (fixed right-8) reaches ~137px inward at lg+.
          max-w-7xl gets zero auto-margin help until viewport > 1280px, so
          don't taper this padding down at xl like product-scene.tsx does -
          measured that to still overlap right at 1280px. Flat lg:pr-40 keeps
          clearance until auto-margin takes over past 1280px.
        */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-8 sm:px-8 md:px-10 lg:px-10 lg:pr-40">
          {category === null ? (
            <CategoryChooser isActive={isActive} onSelectCategory={onSelectCategory} />
          ) : null}

          {category === 'gin' ? <GinShelf isActive={isActive} /> : null}

          {category === 'sets' ? <SetsShelf isActive={isActive} /> : null}

          {category === 'merch' ? <MerchShelf isActive={isActive} /> : null}
        </div>

        <BrandFooter />
      </div>
    </motion.div>
  );
}

interface CategoryChooserProps {
  isActive: boolean;
  onSelectCategory: (category: StoreCategory) => void;
}

function CategoryChooser({ isActive, onSelectCategory }: CategoryChooserProps) {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-1 gap-8 pb-10 md:grid-cols-3 md:gap-6 lg:gap-8">
      {STORE_CATEGORIES.map((storeCategory, index) => (
        <motion.button
          key={storeCategory}
          type="button"
          onClick={() => onSelectCategory(storeCategory)}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
          transition={{ duration: 0.7, delay: 0.12 * index, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex flex-col overflow-hidden border border-[#F5EFE6]/10 bg-[#1c1109]/40 text-left transition-colors duration-500 hover:border-[#D4A373]/60"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={CATEGORY_COVERS[storeCategory]}
              alt={t(`store.categories.${storeCategory}.title`)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              draggable={false}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#160d09] via-[#160d09]/20 to-transparent" />
          </div>

          <div className="flex flex-1 flex-col p-6 lg:p-7">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: CATEGORY_ACCENTS[storeCategory] }}
            >
              {/* `value`, not `count`: passing `count` would send i18next hunting for
                  plural-suffixed keys, which Arabic alone splits six ways. */}
              {t('store.itemCount', { value: CATEGORY_COUNTS[storeCategory] })}
            </span>
            <h2 className="mt-3 font-ergon-light text-3xl uppercase leading-tight text-[#F5EFE6] lg:text-4xl">
              {t(`store.categories.${storeCategory}.title`)}
            </h2>
            <p className="mt-4 flex-1 font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/62">
              {t(`store.categories.${storeCategory}.description`)}
            </p>
            <span className="mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#D4A373]">
              {t('store.browse')}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function GinShelf({ isActive }: { isActive: boolean }) {
  const { classic, limited } = useGinEditions();

  return (
    <div className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-2 lg:gap-8">
      {[classic, limited].map((edition, index) => (
        <GinPurchaseCard
          key={edition.id}
          data={edition}
          index={index}
          isActive={isActive}
          cover={edition.id === 'classic' ? bottleClassic : bottleLimited}
        />
      ))}
    </div>
  );
}

interface GinPurchaseCardProps {
  data: ProductData;
  index: number;
  isActive: boolean;
  cover: string;
}

/**
 * The full buy flow for one gin edition, inline in the store. Shares
 * useProductPurchase with the standalone product pages, so format options,
 * live pricing and the discounted 2x variants behave identically here.
 */
function GinPurchaseCard({ data, index, isActive, cover }: GinPurchaseCardProps) {
  const { t } = useTranslation('common');
  const {
    selectedOption,
    selectPurchase,
    qty,
    setQty,
    purchaseOptions,
    selectedPurchase,
    isLoading,
    handleAddToCart,
    optionPrice,
    displayPrice,
    productName,
    productDescription,
  } = useProductPurchase(data);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col border border-[#F5EFE6]/10 bg-[#1c1109]/40 p-6 lg:p-8"
    >
      <div className="relative mx-auto flex h-56 w-full items-center justify-center overflow-hidden lg:h-64">
        <img
          src={selectedPurchase.image || cover}
          alt={productName}
          className="h-full w-auto max-w-full object-contain"
          draggable={false}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>

      <h3 className="mt-6 font-ergon-light text-2xl leading-tight text-[#F5EFE6] lg:text-3xl">
        {productName}
      </h3>
      <p className="mt-4 font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/62">
        {productDescription}
      </p>

      <p className="mt-6 font-ergon-light text-3xl text-[#D4A373]">{displayPrice}</p>

      <div className="mt-6 space-y-2">
        {purchaseOptions.map((purchaseOption, optionIndex) => {
          const isSelected = selectedOption === optionIndex;

          return (
            <button
              key={purchaseOption.size}
              type="button"
              onClick={() => selectPurchase(optionIndex)}
              className={cn(
                'flex w-full items-start justify-between border px-3 py-2.5 text-left transition-all duration-300',
                isSelected
                  ? 'border-[#D4A373] bg-[#D4A373]/10 text-[#F5EFE6]'
                  : 'border-[#F5EFE6]/10 text-[#F5EFE6]/64 hover:border-[#F5EFE6]/28',
              )}
            >
              <span className="flex-1 pr-2 text-xs font-light uppercase leading-snug tracking-[0.14em]">
                {purchaseOption.size}
              </span>
              <span
                className={cn(
                  'min-w-[4.5rem] shrink-0 whitespace-nowrap pl-3 text-right text-[10px] font-light uppercase tracking-[0.14em]',
                  isSelected ? 'text-[#D4A373]' : 'text-[#F5EFE6]/44',
                )}
              >
                {optionPrice(purchaseOption)}
              </span>
            </button>
          );
        })}
      </div>

      {selectedPurchase.note ? (
        <p className="mt-4 whitespace-pre-line font-ergon-light text-xs leading-relaxed text-[#F5EFE6]/70">
          {selectedPurchase.note}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between border border-[#F5EFE6]/10 px-3 py-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#F5EFE6]/50">
          {t('ui.product.quantity')}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty(q => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex h-6 w-6 items-center justify-center border border-[#F5EFE6]/20 text-[#F5EFE6] transition-colors hover:border-[#F5EFE6]/50 disabled:opacity-30"
          >
            <span className="select-none text-sm leading-none">−</span>
          </button>
          <span className="min-w-[1.25rem] text-center text-sm font-light text-[#F5EFE6]">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(q => q + 1)}
            className="flex h-6 w-6 items-center justify-center border border-[#F5EFE6]/20 text-[#F5EFE6] transition-colors hover:border-[#F5EFE6]/50"
          >
            <span className="select-none text-sm leading-none">+</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading}
        className={cn(
          'group/cta relative mt-5 flex w-full items-center justify-between overflow-hidden border border-[#D4A373] px-5 py-4 text-[#D4A373] transition-colors duration-500',
          'hover:text-[#1c1008]',
          isLoading && 'pointer-events-none opacity-50',
        )}
      >
        <span className="relative z-10 text-xs font-light uppercase tracking-[0.3em]">
          {t('ui.product.addToCart')}
        </span>
        <ShoppingCart size={14} className="relative z-10" />
        <span className="absolute inset-0 origin-left scale-x-0 bg-[#D4A373] transition-transform duration-500 group-hover/cta:scale-x-100" />
      </button>
    </motion.article>
  );
}

function SetsShelf({ isActive }: { isActive: boolean }) {
  const { t } = useTranslation('common');
  const { addItem, isLoading } = useCart();
  const { currency } = useMarket();

  const setVariantIds = BUNDLES.map(b => shopifySetsMapping[b.id]?.shopifyVariantId).filter(Boolean) as string[];
  const { data: priceMap } = useMarketPrices(setVariantIds);

  const handleAddToCart = async (bundle: SetBundle) => {
    const shopify = shopifySetsMapping[bundle.id];
    if (!shopify) return;

    const title = t(`sets.bundles.${bundle.id}.title`);

    const livePrice = priceEntryAmount(priceMap?.get(shopify.shopifyVariantId), bundle.price);

    trackAddToCart({
      content_ids: [shopify.shopifyVariantId],
      content_type: 'product',
      content_name: title,
      currency,
      value: livePrice,
    });

    await addItem({
      id: shopify.shopifyVariantId,
      name: title,
      variant: title,
      price: livePrice,
      image: bundle.image,
      handle: shopify.shopifyHandle,
    });
  };

  return (
    <>
      {BUNDLES.map((bundle, index) => (
        <BundleRow
          key={bundle.id}
          bundle={bundle}
          index={index}
          isActive={isActive}
          displayPrice={formatMarketPrice(
            priceMap,
            shopifySetsMapping[bundle.id]?.shopifyVariantId ?? '',
            formatCHF(bundle.price),
          )}
          isLoading={isLoading}
          onAddToCart={() => handleAddToCart(bundle)}
          title={t(`sets.bundles.${bundle.id}.title`)}
          content={t(`sets.bundles.${bundle.id}.content`)}
        />
      ))}
    </>
  );
}

function MerchShelf({ isActive }: { isActive: boolean }) {
  return (
    <>
      {APPAREL_ITEMS.map((item, index) => (
        <ApparelCard key={item.id} item={item} index={index} isActive={isActive} />
      ))}
    </>
  );
}

interface BundleRowProps {
  bundle: SetBundle;
  index: number;
  isActive: boolean;
  displayPrice: string;
  isLoading: boolean;
  onAddToCart: () => void;
  title: string;
  content: string;
}

function BundleRow({ bundle, index, isActive, displayPrice, isLoading, onAddToCart, title, content }: BundleRowProps) {
  const { t } = useTranslation('common');
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative grid grid-cols-1 items-center gap-10 border-t border-[#F5EFE6]/10 py-14 first:border-t-0 lg:grid-cols-12 lg:grid-flow-dense lg:gap-14 lg:py-20"
    >
      <div
        className={cn(
          'relative z-10 aspect-[4/3] w-full overflow-hidden lg:col-span-7',
          isEven ? 'lg:col-start-1' : 'lg:col-start-6',
        )}
      >
        <img
          src={bundle.image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          draggable={false}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>

      <div
        className={cn(
          'relative z-10 lg:col-span-5',
          isEven ? 'lg:col-start-8' : 'lg:col-start-1',
        )}
      >
        <h3 className="font-ergon-light text-3xl leading-tight text-[#F5EFE6] sm:text-4xl lg:text-5xl">
          {title}
        </h3>
        <p className="mt-5 font-ergon-light text-xl text-[#D4A373]">{displayPrice}</p>

        <p className="mt-6 text-[10px] uppercase tracking-[0.22em] text-[#D4A373]/90">
          {t('sets.includesLabel')}
        </p>
        <p className="mt-2 font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/78">{content}</p>

        <div className="mt-7 space-y-3 border-t border-[#F5EFE6]/10 pt-6">
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isLoading}
            className={cn(
              'group/cta relative flex w-full max-w-md items-center justify-between overflow-hidden border border-[#D4A373] px-5 py-4 text-[#D4A373] transition-colors duration-500',
              'hover:text-[#1c1008]',
              isLoading && 'pointer-events-none opacity-50',
            )}
          >
            <span className="relative z-10 text-xs font-light uppercase tracking-[0.3em]">
              {t('ui.product.addToCart')}
            </span>
            <ShoppingCart size={14} className="relative z-10" />
            <span className="absolute inset-0 origin-left scale-x-0 bg-[#D4A373] transition-transform duration-500 group-hover/cta:scale-x-100" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
