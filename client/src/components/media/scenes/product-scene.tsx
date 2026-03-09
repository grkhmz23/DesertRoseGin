import { useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { AnimatedText } from '@/components/ui/animated-text';
import { LiveBottle } from '@/components/ui/live-bottle';
import { AcquireButton } from '@/components/ui/acquire-button';
import { useCart } from '@/components/cart';
import { RockingBottle } from "@/components/ui/rocking-bottle";
import { getShopifyVariantId } from '@/lib/shopify/products';

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
  const selectedPurchase = isSixBottleBoxSelected && option.boxOption
    ? {
        size: option.boxOption.label,
        price: option.boxOption.price,
        image: option.boxOption.image,
        shopifyLookupSize: option.boxOption.shopifyLookupSize,
        note: option.boxOption.note,
      }
    : {
        size: option.size,
        price: option.price,
        image: option.image,
        shopifyLookupSize: option.shopifyLookupSize,
        note: option.note,
      };
  const showSixBottleBoxToggle = option.size === "500ml Bottle" && !!option.boxOption;

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
      className={`absolute inset-0 flex items-center justify-center overflow-hidden scene-locked product-scene-scroll-fallback ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
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
      <div className="product-scene-inner relative z-10 w-full h-full flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-8 lg:gap-12 px-4 md:px-10 lg:px-20 py-6 md:py-14">

        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="product-scene-text w-full md:w-[54%] lg:w-1/2 md:pr-6 lg:pr-8 space-y-3 md:space-y-6 lg:space-y-8 text-center md:text-left"
        >
          {/* NO YEAR BADGE - REMOVED */}

          {/* Product Name - with word-breaking protection */}
          <div className="product-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lux leading-tight" style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}>
            {productName}
          </div>

          {/* Batch Info - BRIGHTER TEXT */}
          <p className={`text-sm font-ergon-light hidden md:block ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
            {productBatch}
          </p>

          {/* Description - Hidden on mobile, info button instead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-xs md:text-lg leading-relaxed max-w-lg font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
          >
            {productDescription}
            {selectedPurchase.note && (
              <span className="block mt-3 text-sm opacity-80">
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
        className="space-y-3"
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
          "w-full flex items-center justify-between px-3 py-2 border transition-all duration-300",
          selectedOption === index 
            ? isDark 
              ? "border-[#F5EFE6] bg-[#F5EFE6]/10" 
              : "border-[#2B1810] bg-[#2B1810]/10"
            : isDark 
              ? "border-[#F5EFE6]/30 hover:border-[#F5EFE6]/60" 
              : "border-[#2B1810]/30 hover:border-[#2B1810]/60"
        )}
      >
        <span className={`font-ergon-light text-xs uppercase tracking-wider ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
          {option.size}
        </span>
        <span className={`font-lux text-sm ml-3 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
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
        "w-full flex items-center justify-between px-3 py-2 border transition-all duration-300",
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
      <span className={`font-ergon-light text-xs uppercase tracking-wider ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
        6x 500ml Box
      </span>
      <span className={`font-ergon-light text-xs ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
        {option.boxOption?.price}
      </span>
    </button>
  )}
  </></motion.div>

          {/* Order Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex justify-center md:justify-start"><AcquireButton variant={isDark ? "dark" : "light"} label={orderButton} onClick={handleAddToCart} disabled={isLoading} /></div>
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
          className="product-scene-media w-full md:w-[46%] lg:w-1/2 flex items-center justify-center pt-10 sm:pt-12 md:pt-0 mt-2 md:mt-0"
        >
          {option.video && !isSixBottleBoxSelected ? (
            <RockingBottle
              src={option.video}
              alt={productName}
              isActive={isActive}
              className="max-h-[55vh] md:max-h-[70vh]"
            />
          ) : (
            <LiveBottle
              src={selectedPurchase.image}
              alt={productName}
              isActive={isActive}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
