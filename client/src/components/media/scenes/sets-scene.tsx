import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart';
import { shopifySetsMapping } from '@/lib/shopify/products';
import { trackAddToCart } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { BrandFooter } from '@/components/layout/brand-footer';
import { useMarket } from '@/components/market/market-context';
import { useMarketPrices, formatMarketPrice } from '@/hooks/use-market-prices';
import { ApparelCard, type ApparelItem } from '@/components/media/scenes/apparel-card';

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

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
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

export function SetsScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  const { t } = useTranslation('common');
  const { addItem, isLoading } = useCart();
  const { currency } = useMarket();

  const setVariantIds = BUNDLES.map(b => shopifySetsMapping[b.id]?.shopifyVariantId).filter(Boolean) as string[];
  const { data: priceMap } = useMarketPrices(setVariantIds);

  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const handleAddToCart = async (bundle: SetBundle) => {
    const shopify = shopifySetsMapping[bundle.id];
    if (!shopify) return;

    const title = t(`sets.bundles.${bundle.id}.title`);

    const liveEntry = priceMap?.get(shopify.shopifyVariantId);
    const livePrice = liveEntry ? parseFloat(liveEntry.amount) : bundle.price;

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
        {/* HERO */}
        <section className="relative flex min-h-[85vh] flex-col justify-center px-5 pb-16 pt-28 sm:px-8 md:px-10 lg:px-14 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 24 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] text-[#D4A373]">
              <span className="h-px w-10 bg-[#D4A373]" />
              {t('sets.subtitle')}
            </div>
            <h1 className="mt-8 font-ergon-light text-[15vw] uppercase leading-[0.92] text-[#F5EFE6] sm:text-[12vw] md:text-[9vw] lg:text-[7.5rem]">
              {t('sets.title')}
            </h1>
            <p className="mt-8 max-w-lg font-ergon-light text-sm leading-loose text-[#F5EFE6]/65 md:text-base">
              {t('sets.description')}
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-[#F5EFE6]/40">
              <span>{t('ui.product.vatIncluded')}</span>
              <span>{t('ui.product.shippingNote')}</span>
            </div>
          </motion.div>
        </section>

        {/*
          PRODUCT ROWS
          AltimeterNavGallery (fixed right-8) reaches ~137px inward at lg+.
          max-w-7xl gets zero auto-margin help until viewport > 1280px, so
          don't taper this padding down at xl like product-scene.tsx does -
          measured that to still overlap right at 1280px. Flat lg:pr-40 keeps
          clearance until auto-margin takes over past 1280px.
        */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-10 lg:pr-40">
          {BUNDLES.map((bundle, index) => (
            <BundleRow
              key={bundle.id}
              bundle={bundle}
              index={index}
              isActive={isActive}
              displayPrice={formatMarketPrice(
                priceMap,
                shopifySetsMapping[bundle.id]?.shopifyVariantId ?? '',
                `CHF ${bundle.price}`,
              )}
              isLoading={isLoading}
              onAddToCart={() => handleAddToCart(bundle)}
              title={t(`sets.bundles.${bundle.id}.title`)}
              content={t(`sets.bundles.${bundle.id}.content`)}
            />
          ))}
          {APPAREL_ITEMS.map((item, index) => (
            <ApparelCard
              key={item.id}
              item={item}
              index={BUNDLES.length + index}
              isActive={isActive}
            />
          ))}
        </div>

        <BrandFooter />
      </div>
    </motion.div>
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B1810]/15 to-[#120b08]/90" />
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
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#F5EFE6]/48">
            {t('ui.product.vatIncluded')}
          </p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#F5EFE6]/48">
            {t('ui.product.shippingNote')}
          </p>

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
