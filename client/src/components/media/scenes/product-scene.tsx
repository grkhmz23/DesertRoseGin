import { useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { LiveBottle } from '@/components/ui/live-bottle';
import { AcquireButton } from '@/components/ui/acquire-button';
import { useCart } from '@/components/cart';
import { RockingBottle } from "@/components/ui/rocking-bottle";
import { getShopifyVariantId } from '@/lib/shopify/products';
import { Check, ShieldCheck, Truck } from 'lucide-react';

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
    { icon: Check, text: 'Small batch distilled in Switzerland' },
    { icon: ShieldCheck, text: 'Secure checkout' },
    { icon: Truck, text: 'Shipping in 5-7 days' },
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

          {/* NEW: Product Options with Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-3 max-w-xl mx-auto xl:mx-0"
          >
            <>
              {/* Mobile: dropdown selector */}
              <div className="md:hidden w-full">
                <label
                  className={`block text-[11px] uppercase tracking-[0.18em] mb-2 ${
                    isDark ? "text-white/70" : "text-[#2B1810]/70"
                  }`}
                >
                  Choose size
                </label>
                <div className="relative">
                  <select
                    value={selectedOption}
                    onChange={(e) => {
                      const nextIndex = Number(e.target.value);
                      setSelectedOption(nextIndex);
                      setIsSixBottleBoxSelected(false);
                    }}
                    className={`w-full appearance-none border px-4 py-3 pr-10 text-sm outline-none ${isDark ? "border-white/15 bg-white/5 text-white focus:border-white/30" : "border-black/15 bg-black/5 text-[#2B1810] focus:border-black/30"}`}
                    aria-label="Choose product option"
                  >
                    {data.options.map((option, index) => (
                      <option key={index} value={index}>
                        {option.size} — {option.price}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Desktop: separated, smaller buttons with gap */}
              <div className="hidden md:flex flex-col gap-2">
                {data.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedOption(index);
                      setIsSixBottleBoxSelected(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-4 px-3 py-2.5 border transition-all duration-300",
                      selectedOption === index
                        ? isDark
                          ? "border-[#F5EFE6] bg-[#F5EFE6]/10"
                          : "border-[#2B1810] bg-[#2B1810]/10"
                        : isDark
                          ? "border-[#F5EFE6]/30 hover:border-[#F5EFE6]/60"
                          : "border-[#2B1810]/30 hover:border-[#2B1810]/60"
                    )}
                  >
                    <span className={`font-ergon-light text-[11px] lg:text-xs uppercase tracking-wider text-left ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                      {option.size}
                    </span>
                    <span className={`font-lux text-sm shrink-0 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                      {option.price.replace('(IVA incl.)', '')}<span className="text-[9px] opacity-60 ml-1">(IVA incl.)</span>
                    </span>
                  </button>
                ))}
              </div>

              {showSixBottleBoxToggle && (
                <button
                  type="button"
                  onClick={() => setIsSixBottleBoxSelected((prev) => !prev)}
                  className={cn(
                    "w-full flex items-center justify-between gap-4 px-3 py-2.5 border transition-all duration-300",
                    isSixBottleBoxSelected
                      ? isDark
                        ? "border-[#F5EFE6] bg-[#F5EFE6]/10"
                        : "border-[#2B1810] bg-[#2B1810]/10"
                      : isDark
                        ? "border-[#F5EFE6]/20 hover:border-[#F5EFE6]/50"
                        : "border-[#2B1810]/20 hover:border-[#2B1810]/50"
                  )}
                  aria-pressed={isSixBottleBoxSelected}
                >
                  <span className={`font-ergon-light text-[11px] lg:text-xs uppercase tracking-wider text-left ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                    6x 500ml Box
                  </span>
                  <span className={`font-ergon-light text-xs shrink-0 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                    {persistentBoxOption?.price}
                  </span>
                </button>
              )}
            </>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className={cn(
              "max-w-xl mx-auto xl:mx-0 border p-4 md:p-5",
              isDark
                ? "border-[#F5EFE6]/15 bg-[#2B1810]/35"
                : "border-[#2B1810]/12 bg-[#E8DCCA]/45"
            )}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className={`text-[10px] uppercase tracking-[0.22em] ${isDark ? 'text-[#F5EFE6]/50' : 'text-[#2B1810]/50'}`}>
                  Selected format
                </p>
                <h3 className={`text-lg md:text-xl font-lux ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                  {selectedPurchase.size}
                </h3>
                <p className={`text-sm md:text-base font-ergon-light ${isDark ? 'text-[#F5EFE6]/72' : 'text-[#2B1810]/72'}`}>
                  {selectedPurchase.note || 'Choose the bottle size or presentation that best fits the moment.'}
                </p>
              </div>
              <div className={`text-left md:text-right shrink-0 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                <p className="text-[10px] uppercase tracking-[0.22em] opacity-55">Price</p>
                <p className="mt-1 text-2xl font-lux">{selectedPurchase.price.replace(' (IVA incl.)', '')}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] opacity-55">(IVA incl.)</p>
              </div>
            </div>

            <div className={cn(
              "mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4",
              isDark ? "border-[#F5EFE6]/10" : "border-[#2B1810]/10"
            )}>
              {purchaseHighlights.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? 'text-[#F5EFE6]/80' : 'text-[#2B1810]/80'}`} />
                  <p className={`text-[11px] uppercase tracking-[0.14em] leading-relaxed ${isDark ? 'text-[#F5EFE6]/68' : 'text-[#2B1810]/68'}`}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex justify-center xl:justify-start">
              <AcquireButton
                variant={isDark ? "dark" : "light"}
                label={orderButton}
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full sm:w-auto justify-center"
              />
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
