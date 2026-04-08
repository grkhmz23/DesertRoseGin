import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart';
import { shopifySetsMapping } from '@/lib/shopify/products';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

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
    id: 'signatureDuo',
    image: '/2x-500ml-classic-booklet.svg',
    accent: '#CD7E31',
    price: 92,
  },
  {
    id: 'desertSpringBox',
    image: '/classic-limited-box-booklet.svg',
    accent: '#D4A373',
    price: 114,
  },
  {
    id: 'discoveryKit',
    image: '/500ml-limited-200ml-classic-booklet.svg',
    accent: '#E8DCCA',
    price: 76,
  },
  {
    id: 'partyBox10',
    image: '/assets/box/box_6_bottiglie_550x825.webp',
    accent: '#A86A3D',
    price: 95,
  },
  {
    id: 'partyBox20',
    image: '/assets/box/box_6_bottiglie_550x825.webp',
    accent: '#8F5B36',
    price: 180,
  },
];

export function SetsScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  const { t } = useTranslation('common');
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const handleAddToCart = async (bundle: SetBundle) => {
    const shopify = shopifySetsMapping[bundle.id];
    if (!shopify) return;

    const title = t(`sets.bundles.${bundle.id}.title`);

    trackEvent('add_to_cart', {
      product_id: bundle.id,
      product_name: title,
      variant: bundle.id,
      value: bundle.price,
      currency: 'CHF',
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    });

    await addItem({
      id: shopify.shopifyVariantId,
      name: title,
      variant: title,
      price: bundle.price,
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
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 md:px-8 lg:px-10 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl"
          >
            <span className="font-ergon-light text-[10px] uppercase tracking-[0.3em] text-[#D4A373]">
              {t('sets.subtitle')}
            </span>
            <h2 className="mt-4 font-ergon-light text-3xl tracking-tight text-[#F5EFE6] sm:text-4xl md:text-5xl lg:text-6xl">
              {t('sets.title')}
            </h2>
            <p className="mt-5 max-w-2xl font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/68 md:text-base">
              {t('sets.description')}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
            {BUNDLES.map((bundle, index) => (
              <motion.article
                key={bundle.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 28 }}
                transition={{ duration: 0.65, delay: 0.18 + index * 0.08 }}
                className="group overflow-hidden border border-[#F5EFE6]/10 bg-[#1B120E]/70 backdrop-blur-sm flex flex-col"
              >
                <div className="relative h-64 overflow-hidden sm:h-72">
                  <img
                    src={bundle.image}
                    alt={t(`sets.bundles.${bundle.id}.title`)}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2B1810]/15 to-[#120b08]/90" />
                  <div
                    className="absolute left-4 top-4 h-[2px] w-12"
                    style={{ backgroundColor: bundle.accent }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#F5EFE6]/55">
                        {t('sets.cardLabel')}
                      </p>
                      <h3 className="mt-2 font-ergon-light text-xl leading-tight text-[#F5EFE6] sm:text-2xl">
                        {t(`sets.bundles.${bundle.id}.title`)}
                      </h3>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#F5EFE6]/45">
                        {t('sets.priceLabel')}
                      </p>
                      <p className="mt-1 font-ergon-light text-xl text-[#D4A373]">
                        {t(`sets.bundles.${bundle.id}.price`)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5 flex flex-col flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#D4A373]/90">
                    {t('sets.includesLabel')}
                  </p>
                  <p className="font-ergon-light text-sm leading-relaxed text-[#F5EFE6]/78">
                    {t(`sets.bundles.${bundle.id}.content`)}
                  </p>
                  <div className="border-t border-[#F5EFE6]/10 pt-4 space-y-3 mt-auto">
                    <p className="font-ergon-light text-[11px] uppercase tracking-[0.16em] text-[#F5EFE6]/48">
                      {t('ui.product.vatIncluded')}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(bundle)}
                      disabled={isLoading}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-3 transition-colors duration-300",
                        "bg-[#F3EFE7] text-[#0D0B0A] hover:bg-[#D4A373]",
                        isLoading && "opacity-60 cursor-not-allowed",
                      )}
                    >
                      <span className="text-xs font-light uppercase tracking-[0.22em]">
                        {t('ui.product.addToCart')}
                      </span>
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
