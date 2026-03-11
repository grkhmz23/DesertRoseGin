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
  const showSixBottleBoxToggle = !!persistentBoxOption;
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
  const orderButton = t(`${productKey}.button`);

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
      <div className="product-scene-inner relative z-10 w-full min-h-full flex flex-col-reverse xl:flex-row items-center justify-center xl:justify-between gap-6 md:gap-8 xl:gap-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 py-24 md:py-28 xl:py-16 2xl:py-20">

        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="product-scene-text w-full max-w-2xl xl:max-w-[34rem] 2xl:max-w-[38rem] xl:w-[52%] xl:pr-8 2xl:pr-10 space-y-3 md:space-y-4 xl:space-y-5 text-center xl:text-left"
        >
          {/* NO YEAR BADGE - REMOVED */}

          {/* Product Name - with word-breaking protection */}
          <div
            className="product-title mx-auto xl:mx-0 max-w-[22rem] sm:max-w-[28rem] xl:max-w-[30rem] 2xl:max-w-[33rem] text-[clamp(2rem,4vw,3.7rem)] font-lux leading-[1.04]"
            style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
          >
            {productName}
          </div>

          {/* Batch Info - BRIGHTER TEXT */}
          <p className={`text-xs md:text-sm font-ergon-light hidden md:block ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
            {productBatch}
          </p>

          {/* Description - Hidden on mobile, info button instead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`mx-auto xl:mx-0 text-sm md:text-base xl:text-lg leading-relaxed max-w-xl font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
          >
            {productDescription}
            {selectedPurchase.note && (
              <span className="block mt-3 text-xs md:text-sm opacity-80">
                {selectedPurchase.note}
              </span>
            )}
          </motion.p>
          


          {/* NO BOTANICALS - REMOVED */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className={cn(
              "relative mx-auto xl:mx-0 w-full max-w-xl overflow-hidden border px-4 py-5 md:px-6 md:py-6 shadow-xl",
              isDark
                ? "border-[#F5EFE6]/10 bg-[linear-gradient(180deg,rgba(43,24,16,0.38),rgba(43,24,16,0.54))] text-[#F5EFE6] backdrop-blur-[2px]"
                : "border-[#8E7A57]/22 bg-[linear-gradient(180deg,rgba(232,220,202,0.34),rgba(205,190,163,0.46))] text-[#2C2416] backdrop-blur-[2px]"
            )}
          >
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className={cn(
                "text-4xl md:text-5xl font-light tracking-wide mb-1",
                isDark ? "text-[#FDFBFC]" : "text-[#2C2416]"
              )}>
                {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
              </h2>
              <p className={cn(
                "text-sm md:text-base font-light mb-5",
                isDark ? "text-[#E3D5C3]" : "text-[#5A4734]"
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
                        "px-4 py-2.5 text-xs md:text-sm transition-all duration-300",
                        isSelected
                          ? isDark
                            ? "bg-[#CD7E31] text-[#24160F] font-medium shadow-sm"
                            : "bg-[#917D37] text-[#F9F5F0] font-medium shadow-sm"
                          : isDark
                            ? "bg-transparent border border-white/30 text-white/90 font-normal hover:bg-white/10"
                            : "bg-transparent border border-[#2C2416]/20 text-[#2C2416] font-normal hover:bg-[#2C2416]/5"
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
                  "w-full max-w-2xl disabled:opacity-70 py-4 px-5 flex items-center justify-center gap-3 transition-colors duration-300 shadow-md",
                  isDark
                    ? "bg-[#CD7E31] hover:bg-[#BA6F2C] text-[#24160F]"
                    : "bg-[#917D37] hover:bg-[#7C6A2F] text-[#F9F5F0]"
                )}
              >
                <ShoppingCart size={26} strokeWidth={1.5} />
                <span className="text-sm md:text-base font-medium tracking-[0.15em] uppercase pt-0.5">
                  {orderButton}
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-x-5 md:gap-x-8 gap-y-3 mt-6 w-full max-w-3xl">
                {purchaseHighlights.map(({ icon: Icon, text }) => (
                  <div key={text} className={cn(
                    "flex items-center gap-2.5",
                    isDark ? "text-[#E6D7C6]" : "text-[#534737]"
                  )}>
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-xs md:text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <p className={cn(
                "mt-8 text-xs md:text-sm tracking-[0.15em] uppercase opacity-90 font-medium",
              isDark ? "text-[#DCCFBE]" : "text-[#7A6751]"
              )}>
                Please enjoy responsibly
              </p>
            </div>
          </motion.div>

        </motion.div>

        {/* Right Side - Bottle (changes based on selected option) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ 
            opacity: isActive ? 1 : 0, 
            scale: isActive ? 1 : 0.8,
            x: isActive ? 0 : 50 
          }}
          transition={{ duration: 1, delay: 0.4 }}
          className="product-scene-media w-full max-w-[20rem] sm:max-w-[23rem] md:max-w-[24rem] lg:max-w-[26rem] xl:max-w-none xl:w-[42%] 2xl:w-[46%] flex items-center justify-center pt-6 md:pt-8 xl:pt-6 mt-0 xl:-translate-x-8 2xl:-translate-x-10 xl:translate-y-4 2xl:translate-y-6"
        >
          {option.video && !isSixBottleBoxSelected ? (
            <RockingBottle
              src={option.video}
              alt={productName}
              isActive={isActive}
              className="max-h-[38vh] sm:max-h-[42vh] md:max-h-[46vh] xl:max-h-[62vh] 2xl:max-h-[70vh]"
            />
          ) : (
            <LiveBottle
              src={selectedPurchase.image}
              alt={productName}
              isActive={isActive}
              className={cn(
                "max-h-[38vh] sm:max-h-[42vh] md:max-h-[46vh] xl:max-h-[62vh] 2xl:max-h-[70vh]",
                (isBoxPurchase || isGiftPurchase) && "max-w-[19rem] sm:max-w-[22rem] md:max-w-[23rem] xl:max-w-[26rem] 2xl:max-w-[28rem]",
                isSmallFormat && "max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] xl:max-w-[20rem] 2xl:max-w-[22rem]"
              )}
              imageClassName={cn(
                (isBoxPurchase || isGiftPurchase) && "mx-auto max-h-[36vh] sm:max-h-[40vh] md:max-h-[44vh] xl:max-h-[54vh] 2xl:max-h-[58vh]",
                isSmallFormat && "mx-auto scale-[0.86] sm:scale-[0.9] md:scale-[0.92] xl:scale-[0.94]"
              )}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
