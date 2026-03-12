import { useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { LiveBottle } from '@/components/ui/live-bottle';
import { useCart } from '@/components/cart';
import { RockingBottle } from "@/components/ui/rocking-bottle";
import { getShopifyVariantId } from '@/lib/shopify/products';
import { ShoppingCart, Sparkles, Shield, Truck } from 'lucide-react';

const limitedBackgroundDesktop = "/backgrounds/limited-bg.webp";
const limitedBackgroundMobile = "/backgrounds/limited-bg-mobile.webp";
const classicBackgroundDesktop = "/backgrounds/classic-bg.webp";
const classicBackgroundMobile = "/backgrounds/classic-bg-mobile.webp";

// NEW: Product option interface for pricing
export interface ProductOption {
  size: string;
  price: string;
  image: string;
  video?: string;
  shopifyVariantId?: string; // Optional: Shopify variant ID
  shopifyLookupSize?: string;
  note?: string;
  boxOption?: {
    label: string;
    price: string;
    image: string;
    shopifyLookupSize?: string;
    note?: string;
  };
}

export interface ProductData {
  id: string;
  name: string;
  batch: string;
  abv: string;
  description: string;
  options: ProductOption[];
  shopifyHandle?: string;
}

interface ProductSceneProps {
  data: ProductData;
  isActive: boolean;
  direction: number;
}

export function ProductScene({ data, isActive, direction }: ProductSceneProps) {
  const { t } = useTranslation('common');
  const isDark = data.id === 'limited';
  const [selectedOption, setSelectedOption] = useState(0);
  const [isSixBottleBoxSelected, setIsSixBottleBoxSelected] = useState(false);
  
  const { addItem, isLoading } = useCart();
  const option = data.options[selectedOption];
  const persistentBoxOption = data.options.find((productOption) => productOption.boxOption)?.boxOption;
  const purchaseOptions = [
    ...data.options.map((productOption) => ({
      size: productOption.size,
      price: productOption.price,
      image: productOption.image,
      shopifyLookupSize: productOption.shopifyLookupSize,
      note: productOption.note,
      isBox: false,
    })),
    ...(persistentBoxOption
      ? [{
          size: persistentBoxOption.label,
          price: persistentBoxOption.price,
          image: persistentBoxOption.image,
          shopifyLookupSize: persistentBoxOption.shopifyLookupSize,
          note: persistentBoxOption.note,
          isBox: true,
        }]
      : []),
  ];
  const selectedPurchaseIndex = isSixBottleBoxSelected
    ? purchaseOptions.findIndex((purchaseOption) => purchaseOption.isBox)
    : selectedOption;
  const selectedPurchase = isSixBottleBoxSelected && persistentBoxOption
    ? {
        size: persistentBoxOption.label,
        price: persistentBoxOption.price,
        image: persistentBoxOption.image,
        shopifyLookupSize: persistentBoxOption.shopifyLookupSize,
        note: persistentBoxOption.note,
      }
    : {
        size: option.size,
        price: option.price,
        image: option.image,
        shopifyLookupSize: option.shopifyLookupSize,
        note: option.note,
      };
  const isBoxPurchase = /box/i.test(selectedPurchase.size);
  const isGiftPurchase = /gift/i.test(selectedPurchase.size);
  const isSmallFormat = /200ml/i.test(selectedPurchase.size);
  const purchaseHighlights = [
    { icon: Sparkles, text: 'Small batch distilled in Switzerland' },
    { icon: Shield, text: 'Secure checkout' },
    { icon: Truck, text: 'Shipping 2-4 days' },
  ];

  const handleAddToCart = async () => {
    const priceString = selectedPurchase.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceString);
    
    if (isNaN(price)) {
      console.error('Invalid price format:', selectedPurchase.price);
      return;
    }
    
    // Try to get Shopify variant ID from option or lookup from mapping
    const lookupSize = selectedPurchase.shopifyLookupSize || selectedPurchase.size;
    const variantId = option.shopifyVariantId || getShopifyVariantId(data.id, lookupSize);
    
    if (!variantId) {
      console.warn('No Shopify variant ID found for:', data.id, lookupSize);
      // Still add to local cart even without Shopify ID
    }
    
    await addItem({
      id: variantId || `${data.id}-${lookupSize}`, // Use variant ID if available, fallback to internal ID
      name: data.name,
      variant: selectedPurchase.size,
      price: price,
      image: selectedPurchase.image,
      handle: data.shopifyHandle || data.id,
    });
  };

  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';
  const productName = t(`${productKey}.name`);
  const productBatch = t(`${productKey}.batch`);
  const productDescription = t(`${productKey}.description`);
  const addToCartLabel = 'Add to Cart';
  // 6x box is positioned fixed on the right side to avoid overlapping with price panel
// Bottles and gift box stay in the grid
  const renderProductMedia = (className?: string) => {
    if (option.video && !isSixBottleBoxSelected) {
      return (
        <RockingBottle
          src={option.video}
          alt={productName}
          isActive={isActive}
          className={cn(
            "max-h-[38vh] sm:max-h-[42vh] md:max-h-[46vh] xl:max-h-[62vh] 2xl:max-h-[70vh]",
            className,
          )}
        />
      );
    }

    return (
      <LiveBottle
        src={selectedPurchase.image}
        alt={productName}
        isActive={isActive}
        className={cn(
          "max-h-[38vh] sm:max-h-[42vh] md:max-h-[46vh] lg:max-h-[62vh] 2xl:max-h-[70vh]",
          isGiftPurchase && "max-w-none lg:max-w-[28rem] 2xl:max-w-[31rem]",
          isSmallFormat && "max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[20rem] 2xl:max-w-[22rem]",
          className,
        )}
        imageClassName={cn(
          "mx-auto h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[58vh] 2xl:h-[64vh] w-auto max-h-none max-w-none",
          isGiftPurchase && "lg:scale-[1.05] 2xl:scale-[1.08]",
          isSmallFormat && "lg:scale-[0.88] 2xl:scale-[0.92]"
        )}
      />
    );
  };

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center overflow-y-auto overflow-x-hidden scene-locked product-scene-scroll-fallback ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: isActive ? '0%' : direction > 0 ? '-100%' : '100%', opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`scene-product-${data.id}`}
      data-scene-type="locked"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {isDark ? (
          <picture className="block w-full h-full">
            <source media="(max-width: 768px)" srcSet={limitedBackgroundMobile} />
            <img 
              src={limitedBackgroundDesktop} 
              alt="Limited Edition Background" 
              className="w-full h-full object-cover" 
              draggable={false} 
            />
          </picture>
        ) : data.id === 'classic' ? (
          <picture className="block w-full h-full">
            <source media="(max-width: 768px)" srcSet={classicBackgroundMobile} />
            <img 
              src={classicBackgroundDesktop} 
              alt="Classic Edition Background" 
              className="w-full h-full object-cover" 
              draggable={false}
            />
          </picture>
        ) : null}
        <div className={`absolute inset-0 ${isDark ? 'bg-[#2B1810]/40' : 'bg-[#E8DCCA]/40'}`} />
      </div>

      {/* Content Container */}
      <div className="product-scene-inner relative z-10 w-full min-h-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-32 pb-16 md:pt-28 md:pb-20 lg:py-16 2xl:py-20">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-6 md:gap-8 lg:max-w-[72rem] lg:grid-cols-[minmax(0,36rem)_minmax(18rem,24rem)] lg:items-end lg:gap-x-6 lg:gap-y-4 xl:max-w-[78rem] xl:grid-cols-[minmax(0,38rem)_minmax(20rem,26rem)] 2xl:max-w-[84rem] 2xl:grid-cols-[minmax(0,40rem)_minmax(22rem,28rem)] text-center lg:text-left"
        >
          <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 space-y-3 md:space-y-4 lg:space-y-5">
            <div
              className="product-title mx-auto lg:mx-0 max-w-[18rem] sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[36rem] 2xl:max-w-[40rem] text-[clamp(1.5rem,7vw,3.7rem)] font-lux leading-[1.04]"
              style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
            >
              {productName}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`mx-auto lg:mx-0 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-[18rem] sm:max-w-[24rem] md:max-w-xl font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
            >
              {productDescription}
              {selectedPurchase.note && (
                <span className="block mt-3 text-xs md:text-sm opacity-80">
                  {selectedPurchase.note}
                </span>
              )}
            </motion.p>
          </div>

          <div className="lg:col-start-1 lg:row-start-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className={cn(
                "relative mx-auto lg:mx-0 w-full max-w-xl lg:max-w-[42rem] px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 text-[#F5EFE6]"
              )}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className={cn(
                  "text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-1",
                  isDark ? "text-[#FFF8F0]" : "text-[#F5EFE6]"
                )}>
                  {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
                </h2>
                <p className={cn(
                  "text-xs sm:text-sm md:text-base font-light mb-4 sm:mb-5",
                  isDark ? "text-[#E9DAC7]/90" : "text-[#F5EFE6]/85"
                )}>
                  incl. Swiss VAT
                </p>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 sm:mb-5 max-w-3xl">
                  {purchaseOptions.map((purchaseOption, index) => {
                    const isSelected = selectedPurchaseIndex === index;

                    return (
                      <button
                        key={purchaseOption.size}
                        type="button"
                        onClick={() => {
                          if (purchaseOption.isBox) {
                            setIsSixBottleBoxSelected(true);
                            return;
                          }
                          setSelectedOption(index);
                          setIsSixBottleBoxSelected(false);
                        }}
                        className={cn(
                          "px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[11px] md:text-xs transition-all duration-300 outline-none focus-visible:outline-none focus-visible:ring-0",
                          isSelected
                            ? isDark
                              ? "bg-[#CD7E31] text-[#24160F] border border-[#CD7E31] font-normal"
                              : "bg-[#4f3f31] text-[#F5EFE6] border border-[#4f3f31] font-normal"
                            : isDark
                              ? "text-white/90 border border-[#CD7E31]/40 hover:border-[#CD7E31]/70 hover:bg-white/5"
                              : "text-[#2B1810] border border-[#4f3f31]/30 hover:border-[#4f3f31]/60 hover:bg-[#4f3f31]/5"
                        )}
                      >
                        {purchaseOption.size}
                      </button>
                    );
                  })}
                </div>

                {selectedPurchase.note ? (
                  <p className={cn(
                    "mb-4 sm:mb-5 max-w-2xl text-[11px] sm:text-xs md:text-sm leading-relaxed font-ergon-light",
                    isDark ? "text-[#F3E6D6]" : "text-[#F5EFE6]/80"
                  )}>
                    {selectedPurchase.note}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={cn(
                    "w-full max-w-2xl disabled:opacity-70 py-3 sm:py-3.5 px-4 sm:px-[1.125rem] flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.06)] outline-none focus-visible:outline-none focus-visible:ring-0",
                    isDark
                      ? "bg-[#CD7E31] hover:bg-[#d68b40] text-[#24160F]"
                      : "bg-[#4f3f31] hover:bg-[#5d4a3a] text-[#F5EFE6]"
                  )}
                >
                  <ShoppingCart size={20} strokeWidth={1.1} />
                  <span className="text-[11px] sm:text-xs md:text-sm font-normal tracking-[0.13em] uppercase pt-0.5">
                    {addToCartLabel}
                  </span>
                </button>

                <div className="mt-5 sm:mt-6 w-full overflow-x-auto">
                  <div className="flex min-w-max flex-nowrap items-center justify-center gap-3 px-1 md:gap-5">
                  {purchaseHighlights.map(({ icon: Icon, text }) => (
                    <div key={text} className={cn(
                      "flex shrink-0 items-center gap-1.5 whitespace-nowrap",
                      isDark ? "text-[#E6D7C6]/92" : "text-[#F5EFE6]/78"
                    )}>
                      <Icon size={14} strokeWidth={1.1} />
                      <span className="text-[9px] md:text-[11px] font-normal">{text}</span>
                    </div>
                  ))}
                  </div>
                </div>

                <p className={cn(
                  "mt-6 sm:mt-8 text-[11px] sm:text-xs md:text-sm tracking-[0.15em] uppercase opacity-90 font-medium",
                isDark ? "text-[#DCCFBE]" : "text-[#F5EFE6]/80"
                )}>
                  Please enjoy responsibly
                </p>
              </div>
            </motion.div>
          </div>

          {/* Product Image - All products same height, fixed right position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8, x: isActive ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex fixed right-12 top-1/2 -translate-y-1/4 z-30 2xl:right-16"
          >
            <img 
              src={selectedPurchase.image} 
              alt={productName}
              className={cn(
              "w-auto object-contain",
              isBoxPurchase && "h-[42vh] 2xl:h-[48vh] max-w-[24rem] 2xl:max-w-[28rem]",
              isGiftPurchase && "h-[54vh] 2xl:h-[58vh] max-w-[22rem] 2xl:max-w-[26rem]",
              !isBoxPurchase && !isGiftPurchase && "h-[60vh] 2xl:h-[64vh] max-w-[20rem] 2xl:max-w-[24rem]"
            )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ 
              opacity: isActive ? 1 : 0, 
              scale: isActive ? 1 : 0.8,
              x: isActive ? 0 : 50 
            }}
            transition={{ duration: 1, delay: 0.4 }}
            className="product-scene-media w-full max-w-[16rem] sm:max-w-[19rem] md:max-w-[22rem] flex items-center justify-center pt-4 sm:pt-6 md:pt-8 mt-0 lg:hidden"
          >
            {renderProductMedia()}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
