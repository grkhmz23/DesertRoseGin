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
              "relative mx-auto xl:mx-0 w-full max-w-3xl overflow-hidden border px-4 py-8 md:px-10 md:py-12 shadow-2xl",
              isDark
                ? "border-[#F5EFE6]/12 bg-[#9a876d]/70 text-[#2C2416]"
                : "border-[#2B1810]/10 bg-[#a38f72]/78 text-[#2C2416]"
            )}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg viewBox="0 0 1440 800" className="absolute inset-0 h-full w-full object-cover" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id={`bg-base-${data.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B196" />
                    <stop offset="50%" stopColor="#A59174" />
                    <stop offset="100%" stopColor="#877357" />
                  </linearGradient>
                </defs>
                <rect width="1440" height="800" fill={`url(#bg-base-${data.id})`} />
                <path d="M0,0 C300,200 600,0 1000,150 C1300,250 1440,50 1440,50 L1440,0 L0,0 Z" fill="#D2BFA4" fillOpacity="0.4" />
                <path d="M0,0 C250,350 550,100 950,250 C1250,350 1440,100 1440,100 L1440,0 L0,0 Z" fill="#DECCB4" fillOpacity="0.3" />
                <path d="M-100,300 C300,500 600,100 1000,300 C1300,450 1500,200 1500,200 L1500,800 L-100,800 Z" fill="#988467" fillOpacity="0.3" />
                <path d="M0,800 C400,550 700,700 1100,550 C1350,450 1440,600 1440,600 L1440,800 L0,800 Z" fill="#756247" fillOpacity="0.5" />
                <path d="M0,800 C300,450 650,650 1050,400 C1300,250 1440,400 1440,400 L1440,800 L0,800 Z" fill="#65533A" fillOpacity="0.4" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#FDFBFC] tracking-wide mb-2">
                {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
              </h2>
              <p className="text-[#E3D5C3] text-base md:text-lg font-light mb-8">
                incl. Swiss VAT
              </p>

              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 max-w-4xl">
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
                        "px-5 py-3 text-sm md:text-base lg:text-lg transition-all duration-300",
                        isSelected
                          ? "bg-[#CFAD72] text-[#2C2416] font-medium shadow-sm"
                          : "bg-transparent border border-white/40 text-white font-normal hover:bg-white/10"
                      )}
                    >
                      {purchaseOption.size}
                    </button>
                  );
                })}
              </div>

              {selectedPurchase.note ? (
                <p className="mb-8 max-w-3xl text-sm md:text-base text-[#F3E6D6] leading-relaxed font-ergon-light">
                  {selectedPurchase.note}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full max-w-4xl bg-[#CFAD72] hover:bg-[#BFA064] disabled:opacity-70 text-[#2C2416] py-5 px-6 flex items-center justify-center gap-4 transition-colors duration-300 shadow-md"
              >
                <ShoppingCart size={26} strokeWidth={1.5} />
                <span className="text-lg md:text-xl font-medium tracking-[0.15em] uppercase pt-0.5">
                  {orderButton}
                </span>
              </button>

              <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4 mt-10 w-full max-w-4xl">
                {purchaseHighlights.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-[#534737]">
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-sm md:text-base lg:text-lg font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <p className="mt-12 text-[#DCCFBE] text-sm md:text-base tracking-[0.15em] uppercase opacity-90 font-medium">
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
          className="product-scene-media w-full max-w-[20rem] sm:max-w-[23rem] md:max-w-[24rem] lg:max-w-[26rem] xl:max-w-none xl:w-[42%] 2xl:w-[46%] flex items-center justify-center pt-4 md:pt-6 xl:pt-0 mt-0"
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
                isBoxPurchase && "max-w-[24rem] md:max-w-[28rem] xl:max-w-[34rem]",
                isSmallFormat && "max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] xl:max-w-[20rem] 2xl:max-w-[22rem]"
              )}
              imageClassName={cn(
                isBoxPurchase && "mx-auto max-h-[34vh] sm:max-h-[38vh] md:max-h-[42vh] xl:max-h-[52vh] 2xl:max-h-[58vh]",
                isSmallFormat && "mx-auto scale-[0.86] sm:scale-[0.9] md:scale-[0.92] xl:scale-[0.94]"
              )}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
