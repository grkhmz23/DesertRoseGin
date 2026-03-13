import { useState, type CSSProperties } from 'react';

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
  const layoutScaleStyle = {
    "--product-scene-scale": "clamp(0.72, min(calc(100vw / 1280), calc(100vh / 900)), 1)",
  } as CSSProperties;
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
            "max-h-[min(28vh,15rem)] sm:max-h-[min(31vh,17rem)] md:max-h-[min(35vh,20rem)] lg:max-h-[min(42vh,26rem)] xl:max-h-[min(48vh,31rem)] 2xl:max-h-[min(52vh,35rem)]",
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
          "max-h-[min(28vh,15rem)] sm:max-h-[min(31vh,17rem)] md:max-h-[min(35vh,20rem)] lg:max-h-[min(42vh,26rem)] xl:max-h-[min(48vh,31rem)] 2xl:max-h-[min(52vh,35rem)]",
          isGiftPurchase && "max-w-none lg:max-w-[28rem] 2xl:max-w-[31rem]",
          isSmallFormat && "max-w-[16rem] sm:max-w-[17rem] md:max-w-[18rem] lg:max-w-[20rem] 2xl:max-w-[22rem]",
          className,
        )}
        imageClassName={cn(
          "mx-auto h-[min(28vh,15rem)] sm:h-[min(31vh,17rem)] md:h-[min(35vh,20rem)] lg:h-[min(42vh,26rem)] xl:h-[min(48vh,31rem)] 2xl:h-[min(52vh,35rem)] w-auto max-h-none max-w-none",
          isGiftPurchase && "lg:scale-[1.05] 2xl:scale-[1.08]",
          isSmallFormat && "lg:scale-[0.88] 2xl:scale-[0.92]"
        )}
      />
    );
  };

  // Render BOTH mobile and desktop - CSS handles visibility
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
      <div className="product-scene-inner relative z-10 w-full min-h-full px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-16 pt-32 pb-16 md:pt-28 md:pb-20 lg:pt-12 lg:pb-12 xl:py-16 2xl:py-20">

        {/* MOBILE CONTENT - Shows on < 1024px */}
        <div className="lg:hidden h-full w-full flex flex-col items-center justify-center px-4 pt-16 pb-4">
          {/* Title */}
          <div className="text-center mb-2">
            <h1 className={`text-[0.85rem] font-lux leading-tight max-w-[280px] mx-auto ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
              {productName}
            </h1>
          </div>

          {/* Description */}
          <p className={`text-[0.7rem] leading-relaxed text-center max-w-[280px] mx-auto mb-2 line-clamp-2 font-ergon-light ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#2B1810]/90'}`}>
            {productDescription}
          </p>

          {/* Product Image */}
          <div className="flex items-center justify-center my-1">
            <img
              src={selectedPurchase.image}
              alt={productName}
              className="h-[18vh] w-auto object-contain max-w-[200px]"
            />
          </div>

          {/* Price */}
          <div className="text-center mb-2">
            <h2 className="text-2xl font-light tracking-wide text-[#FFF8F0]">
              {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
            </h2>
            <p className="text-[0.7rem] text-[#E9DAC7]/90">
              incl. Swiss VAT
            </p>
          </div>

          {/* Size Selectors */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-2 max-w-[320px]">
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
                    "px-2 py-1 text-[0.65rem] transition-all duration-300",
                    isSelected
                      ? isDark
                        ? "bg-[#CD7E31] text-[#24160F] border border-[#CD7E31]"
                        : "bg-[#4f3f31] text-[#F5EFE6] border border-[#4f3f31]"
                      : isDark
                        ? "text-white/90 border border-[#CD7E31]/40"
                        : "text-[#2B1810] border border-[#4f3f31]/30"
                  )}
                >
                  {purchaseOption.size}
                </button>
              );
            })}
          </div>

          {/* Note */}
          {selectedPurchase.note && (
            <p className={`text-[0.65rem] text-center max-w-[300px] mb-2 font-ergon-light ${isDark ? 'text-[#F5EFE6]/80' : 'text-[#2B1810]/80'}`}>
              {selectedPurchase.note}
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "w-full max-w-[280px] py-2 px-4 flex items-center justify-center gap-2 mb-2 rounded-sm transition-all duration-300",
              isDark
                ? "bg-[#CD7E31] text-[#24160F] hover:bg-[#d68b40]"
                : "bg-[#4f3f31] text-[#F5EFE6] hover:bg-[#5d4a3a]"
            )}
          >
            <ShoppingCart size={16} />
            <span className="text-[0.75rem] tracking-[0.1em] uppercase">
              {addToCartLabel}
            </span>
          </button>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-2">
            {purchaseHighlights.map(({ icon: Icon, text }) => (
              <div key={text} className={`flex items-center gap-1 ${isDark ? 'text-[#E6D7C6]/92' : 'text-[#2B1810]/80'}`}>
                <Icon size={10} />
                <span className="text-[0.6rem]">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <p className={`text-[0.65rem] tracking-[0.1em] uppercase ${isDark ? 'text-[#DCCFBE]' : 'text-[#5D4A3A]'}`}>
            Please enjoy responsibly
          </p>
        </div>

        {/* DESKTOP CONTENT - Shows on >= 1024px */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:grid mx-auto w-full max-w-[min(72rem,calc(100vw-5rem))] grid-cols-[minmax(0,36rem)_minmax(16rem,22rem)] items-center gap-x-5 gap-y-4 xl:max-w-[78rem] xl:grid-cols-[minmax(0,38rem)_minmax(18rem,24rem)] 2xl:max-w-[84rem] 2xl:grid-cols-[minmax(0,40rem)_minmax(20rem,26rem)] text-left"
          style={{
            ...layoutScaleStyle,
            transform: "scale(var(--product-scene-scale))",
          }}
        >
          {/* DESKTOP: Title + Description */}
          <div className="col-start-1 row-start-1 row-span-2 space-y-4 pt-0">
            <h1
              className="product-title mx-0 max-w-none text-[clamp(1.05rem,2.8vw,3rem)] font-lux leading-[1.05]"
              style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
            >
              {productName}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`mx-0 text-[clamp(0.72rem,0.95vw,1rem)] leading-relaxed max-w-[32rem] font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
            >
              {productDescription}
            </motion.p>
          </div>

          {/* DESKTOP: Pricing Panel */}
          <div className="col-start-1 row-start-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className={cn(
                "relative mx-0 w-full max-w-[42rem] px-3 py-4 text-[#F5EFE6]"
              )}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className={cn(
                  "text-[clamp(1.8rem,3vw,3.4rem)] font-light tracking-wide mb-1",
                  isDark ? "text-[#FFF8F0]" : "text-[#F5EFE6]"
                )}>
                  {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
                </h2>
                <p className={cn(
                  "text-[clamp(0.72rem,0.95vw,1rem)] font-light mb-4",
                  isDark ? "text-[#E9DAC7]/90" : "text-[#F5EFE6]/85"
                )}>
                  incl. Swiss VAT
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-3xl">
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
                          "px-2.5 py-1.5 text-[clamp(0.62rem,0.78vw,0.8rem)] transition-all duration-300 outline-none focus-visible:outline-none focus-visible:ring-0",
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
                    "mb-4 max-w-2xl text-[clamp(0.68rem,0.85vw,0.92rem)] leading-relaxed font-ergon-light",
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
                    "w-full max-w-2xl disabled:opacity-70 py-2.5 px-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.06)] outline-none focus-visible:outline-none focus-visible:ring-0",
                    isDark
                      ? "bg-[#CD7E31] hover:bg-[#d68b40] text-[#24160F]"
                      : "bg-[#4f3f31] hover:bg-[#5d4a3a] text-[#F5EFE6]"
                  )}
                >
                  <ShoppingCart size={20} strokeWidth={1.1} />
                  <span className="text-[clamp(0.68rem,0.82vw,0.92rem)] font-normal tracking-[0.13em] uppercase pt-0.5">
                    {addToCartLabel}
                  </span>
                </button>

                <div className="mt-5 w-full overflow-x-auto">
                  <div className="flex min-w-max flex-nowrap items-center justify-center gap-3 px-1">
                  {purchaseHighlights.map(({ icon: Icon, text }) => (
                    <div key={text} className={cn(
                      "flex shrink-0 items-center gap-1.5 whitespace-nowrap",
                      isDark ? "text-[#E6D7C6]/92" : "text-[#F5EFE6]/78"
                    )}>
                      <Icon size={14} strokeWidth={1.1} />
                      <span className="text-[clamp(0.56rem,0.72vw,0.72rem)] font-normal">{text}</span>
                    </div>
                  ))}
                  </div>
                </div>

                <p className={cn(
                  "mt-6 text-[clamp(0.68rem,0.82vw,0.92rem)] tracking-[0.15em] uppercase opacity-90 font-light",
                isDark ? "text-[#DCCFBE]" : "text-[#F5EFE6]/80"
                )}>
                  Please enjoy responsibly
                </p>
              </div>
            </motion.div>
          </div>

          {/* DESKTOP: Product Image - Grid column 2, vertically centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8, x: isActive ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="col-start-2 row-start-1 row-span-3 flex items-center justify-center self-center z-30"
          >
            {renderProductMedia("w-full max-w-[18rem] xl:max-w-[22rem] 2xl:max-w-[26rem]")}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
