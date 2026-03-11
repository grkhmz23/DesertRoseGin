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
  const desktopMediaWidthClass = isGiftPurchase
    ? "lg:w-[26rem] 2xl:w-[29rem]"
    : isBoxPurchase
      ? "lg:w-[22rem] 2xl:w-[24rem]"
      : "lg:w-[22rem] 2xl:w-[25rem]";
  const desktopMediaPositionClass = isBoxPurchase
    ? "lg:translate-x-16 lg:-translate-y-1 2xl:translate-x-20 2xl:-translate-y-2"
    : isGiftPurchase
      ? "lg:translate-x-2 lg:-translate-y-1 2xl:translate-x-3 2xl:-translate-y-2"
      : "";

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
          isGiftPurchase && "max-w-none lg:max-w-[32rem] 2xl:max-w-[36rem]",
          isBoxPurchase && "max-w-none lg:max-w-[32rem] 2xl:max-w-[36rem]",
          isSmallFormat && "max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[20rem] 2xl:max-w-[22rem]",
          className,
        )}
        imageClassName={cn(
          isGiftPurchase && "mx-auto h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[62vh] 2xl:h-[68vh] w-auto max-h-none max-w-none scale-[1.08]",
          isBoxPurchase && "mx-auto h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[50vh] 2xl:h-[55vh] w-auto max-h-none max-w-none scale-[0.9]",
          !isGiftPurchase && !isBoxPurchase && "mx-auto h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[62vh] 2xl:h-[68vh] w-auto max-h-none max-w-none",
          isSmallFormat && "scale-[0.86] sm:scale-[0.9] md:scale-[0.92] lg:scale-[0.94]"
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
      <div className="product-scene-inner relative z-10 w-full min-h-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-24 md:py-28 lg:py-16 2xl:py-20">

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-6 md:gap-8 lg:max-w-[72rem] lg:grid-cols-[minmax(0,36rem)_minmax(18rem,24rem)] lg:items-end lg:gap-x-6 lg:gap-y-4 xl:max-w-[78rem] xl:grid-cols-[minmax(0,38rem)_minmax(20rem,26rem)] 2xl:max-w-[84rem] 2xl:grid-cols-[minmax(0,40rem)_minmax(22rem,28rem)] text-center lg:text-left"
        >
          <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 space-y-3 md:space-y-4 lg:space-y-5">
            <div
              className="product-title mx-auto lg:mx-0 max-w-[22rem] sm:max-w-[28rem] lg:max-w-[36rem] 2xl:max-w-[40rem] text-[clamp(2rem,4vw,3.7rem)] font-lux leading-[1.04]"
              style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
            >
              {productName}
            </div>

            <p className={`text-xs md:text-sm font-ergon-light hidden md:block ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
              {productBatch}
            </p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`mx-auto lg:mx-0 text-sm md:text-base lg:text-lg leading-relaxed max-w-xl font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
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
                "relative mx-auto lg:mx-0 w-full max-w-xl lg:max-w-none overflow-hidden border px-4 py-5 md:px-6 md:py-6 shadow-[0_18px_60px_rgba(0,0,0,0.14)]",
                isDark
                  ? "border-white/10 bg-[linear-gradient(180deg,rgba(57,34,25,0.16),rgba(22,12,8,0.3))] text-[#F5EFE6] backdrop-blur-[10px]"
                  : "border-[#fff7eb]/35 bg-[linear-gradient(180deg,rgba(255,251,244,0.18),rgba(237,224,200,0.22))] text-[#2C2416] backdrop-blur-[10px]"
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0",
                  isDark
                    ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%,rgba(205,126,49,0.1))]"
                    : "bg-[linear-gradient(135deg,rgba(255,255,255,0.26),transparent_45%,rgba(205,126,49,0.08))]"
                )}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className={cn(
                  "text-4xl md:text-5xl font-light tracking-wide mb-1",
                  isDark ? "text-[#FFF8F0]" : "text-[#3B2B1C]"
                )}>
                  {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
                </h2>
                <p className={cn(
                  "text-sm md:text-base font-light mb-5",
                  isDark ? "text-[#E9DAC7]/90" : "text-[#715a46]"
                )}>
                  incl. Swiss VAT
                </p>

                <div className="flex flex-wrap justify-center gap-2.5 md:gap-3 mb-5 max-w-3xl">
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
                          "px-4 py-2.5 text-xs md:text-sm transition-all duration-300 backdrop-blur-sm",
                          isSelected
                            ? isDark
                              ? "border border-[#d7a46b]/60 bg-[rgba(205,126,49,0.22)] text-[#FFF3E2] font-medium shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                              : "border border-[#b29463]/55 bg-[rgba(209,186,142,0.26)] text-[#4A3722] font-medium shadow-[0_10px_24px_rgba(120,90,43,0.12)]"
                            : isDark
                              ? "border border-white/20 bg-[rgba(255,255,255,0.04)] text-white/88 font-normal hover:bg-white/10"
                              : "border border-[#8d755d]/22 bg-[rgba(255,255,255,0.12)] text-[#4D3A27] font-normal hover:bg-[rgba(255,255,255,0.22)]"
                        )}
                      >
                        {purchaseOption.size}
                      </button>
                    );
                  })}
                </div>

                {selectedPurchase.note ? (
                  <p className={cn(
                    "mb-5 max-w-2xl text-xs md:text-sm leading-relaxed font-ergon-light",
                    isDark ? "text-[#F3E6D6]" : "text-[#4C3B2A]"
                  )}>
                    {selectedPurchase.note}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={cn(
                    "w-full max-w-2xl disabled:opacity-70 py-4 px-5 flex items-center justify-center gap-3 border transition-colors duration-300 shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
                    isDark
                      ? "border-[#d7a46b]/55 bg-[linear-gradient(180deg,rgba(223,158,91,0.92),rgba(195,118,48,0.9))] hover:bg-[linear-gradient(180deg,rgba(229,168,104,0.96),rgba(205,126,49,0.92))] text-[#24160F]"
                      : "border-[#c0ab82]/50 bg-[linear-gradient(180deg,rgba(190,165,115,0.88),rgba(145,125,55,0.88))] hover:bg-[linear-gradient(180deg,rgba(202,176,126,0.92),rgba(157,136,64,0.9))] text-[#FFF9F1]"
                  )}
                >
                  <ShoppingCart size={26} strokeWidth={1.5} />
                  <span className="text-sm md:text-base font-medium tracking-[0.15em] uppercase pt-0.5">
                    {addToCartLabel}
                  </span>
                </button>

                <div className="mt-6 w-full overflow-x-auto">
                  <div className="flex min-w-max flex-nowrap items-center justify-center gap-3 px-1 md:gap-5">
                  {purchaseHighlights.map(({ icon: Icon, text }) => (
                    <div key={text} className={cn(
                      "flex shrink-0 items-center gap-1.5 whitespace-nowrap",
                      isDark ? "text-[#E6D7C6]/92" : "text-[#6a5844]"
                    )}>
                      <Icon size={16} strokeWidth={1.5} />
                      <span className="text-[10px] md:text-xs font-medium">{text}</span>
                    </div>
                  ))}
                  </div>
                </div>

                <p className={cn(
                  "mt-8 text-xs md:text-sm tracking-[0.15em] uppercase opacity-90 font-medium",
                isDark ? "text-[#DCCFBE]" : "text-[#7A6751]"
                )}>
                  Please enjoy responsibly
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 0.8,
              x: isActive ? 0 : 50
            }}
            transition={{ duration: 1, delay: 0.4 }}
            className={cn(
              "hidden lg:flex product-scene-media lg:col-start-2 lg:row-span-3 items-end justify-center lg:justify-start",
              desktopMediaPositionClass,
            )}
          >
            {renderProductMedia(desktopMediaWidthClass)}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ 
              opacity: isActive ? 1 : 0, 
              scale: isActive ? 1 : 0.8,
              x: isActive ? 0 : 50 
            }}
            transition={{ duration: 1, delay: 0.4 }}
            className="product-scene-media w-full max-w-[20rem] sm:max-w-[23rem] md:max-w-[24rem] flex items-center justify-center pt-6 md:pt-8 mt-0 lg:hidden"
          >
            {renderProductMedia()}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
