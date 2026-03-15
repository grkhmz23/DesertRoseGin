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
  const desktopMediaStageClass = "h-[40rem] xl:h-[42rem] 2xl:h-[44rem]";
  const desktopMediaClass = "w-full max-h-none max-w-[32rem] xl:max-w-[34rem] 2xl:max-w-[36rem]";
  const desktopMediaImageClass = "h-full w-auto object-contain origin-center";
  const purchaseHighlights = [
    { icon: Sparkles, text: t('ui.product.highlights.distilled') },
    { icon: Shield, text: t('ui.product.highlights.secure') },
    { icon: Truck, text: t('ui.product.highlights.shipping') },
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
  const productDescription = t(`${productKey}.description`);
  const addToCartLabel = t('ui.product.addToCart');
  const renderProductMedia = (className?: string, imageClassName?: string) => {
    if (option.video && !isSixBottleBoxSelected) {
      return (
        <RockingBottle
          src={option.video}
          alt={productName}
          isActive={isActive}
          className={cn(
            "max-h-[min(56vh,30rem)] sm:max-h-[min(62vh,34rem)] md:max-h-[min(70vh,40rem)] lg:max-h-[min(84vh,52rem)] xl:max-h-[min(96vh,62rem)] 2xl:max-h-[min(100vh,70rem)]",
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
          "w-full max-w-[20rem] max-h-[min(56vh,30rem)] sm:max-w-[22rem] sm:max-h-[min(62vh,34rem)] md:max-w-[24rem] md:max-h-[min(70vh,40rem)] lg:max-w-[32rem] lg:max-h-[min(84vh,52rem)] xl:max-w-[34rem] xl:max-h-[min(96vh,62rem)] 2xl:max-w-[36rem] 2xl:max-h-[min(100vh,70rem)]",
          className,
        )}
        imageClassName={cn(
          "mx-auto h-[min(56vh,30rem)] sm:h-[min(62vh,34rem)] md:h-[min(70vh,40rem)] lg:h-[min(84vh,52rem)] xl:h-[min(96vh,62rem)] 2xl:h-[min(100vh,70rem)] w-auto max-h-full max-w-full object-contain",
          imageClassName,
        )}
      />
    );
  };

  // Render BOTH mobile and desktop - CSS handles visibility
  return (
    <motion.div
      className={`absolute inset-0 flex items-start justify-start overflow-hidden lg:items-center lg:justify-center lg:overflow-y-auto lg:overflow-x-hidden scene-locked product-scene-scroll-fallback ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
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
      <div className="product-scene-inner relative z-10 h-[100dvh] w-full overflow-hidden px-4 pt-24 pb-6 sm:px-6 md:px-8 md:pt-28 md:pb-20 lg:min-h-full lg:h-auto lg:overflow-visible lg:px-8 lg:pt-12 lg:pb-12 xl:px-10 xl:py-16 2xl:px-16 2xl:py-20">

        {/* MOBILE CONTENT - Shows on < 1024px */}
        <div className="lg:hidden flex h-[calc(100dvh-7.5rem)] w-full flex-col items-center justify-center px-4 pt-2 pb-4">
          <div
            className={cn(
              "flex w-full max-w-[22rem] flex-1 flex-col items-center justify-between rounded-[1.5rem] border px-4 py-4 backdrop-blur-[2px]",
              isDark
                ? "border-white/10 bg-[#2B1810]/28 text-[#F5EFE6]"
                : "border-[#2B1810]/10 bg-[#F5EFE6]/22 text-[#2B1810]",
            )}
          >
          <div className="text-center mb-2">
            <h1 className={`text-[0.95rem] font-ergon-light leading-tight max-w-[280px] mx-auto ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
              {productName}
            </h1>
          </div>

          {/* Description */}
          <p className={`text-[0.72rem] leading-relaxed text-center max-w-[280px] mx-auto mb-3 line-clamp-3 font-ergon-light ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#2B1810]/88'}`}>
            {productDescription}
          </p>

          {/* Product Image */}
          <div className="flex items-center justify-center my-2 min-h-[18vh]">
            {renderProductMedia(
              "w-full max-w-[18rem] max-h-[36vh]",
              "h-auto max-h-[36vh] w-auto max-w-[18rem] object-contain",
            )}
          </div>

          {/* Price */}
          <div className="text-center mb-3">
            <h2 className={cn(
              "text-[1.9rem] font-light tracking-wide",
              isDark ? "text-[#FFF8F0]" : "text-[#2B1810]",
            )}>
              {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
            </h2>
            <p className={cn(
              "text-[0.68rem]",
              isDark ? "text-[#E9DAC7]/90" : "text-[#2B1810]/65",
            )}>
              {t('ui.product.vatIncluded')}
            </p>
          </div>

          {/* Size Selectors */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-3 max-w-[320px]">
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
            <p className={`text-[0.65rem] text-center whitespace-pre-line max-w-[300px] mb-3 font-ergon-light ${isDark ? 'text-[#F5EFE6]/80' : 'text-[#2B1810]/78'}`}>
              {selectedPurchase.note}
            </p>
          )}

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoading}
            className={cn(
              "w-full max-w-[280px] py-2.5 px-4 flex items-center justify-center gap-2 mb-3 rounded-sm transition-all duration-300",
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
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mb-3">
            {purchaseHighlights.map(({ icon: Icon, text }) => (
              <div key={text} className={`flex items-center gap-1 ${isDark ? 'text-[#E6D7C6]/92' : 'text-[#2B1810]/80'}`}>
                <Icon size={10} />
                <span className="text-[0.6rem]">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <p className={`w-full text-center text-[0.65rem] tracking-[0.1em] uppercase ${isDark ? 'text-[#DCCFBE]' : 'text-[#5D4A3A]'}`}>
            {t('ui.product.responsibly')}
          </p>
          </div>
        </div>

        {/* DESKTOP CONTENT - Shows on >= 1024px */}
        <div className="hidden lg:block">
          {/* DESKTOP: Fixed top-left title + description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute left-24 top-28 z-20 w-full max-w-[32rem] text-left xl:left-28 xl:top-32 xl:max-w-[36rem]"
          >
            <h1
              className="product-title mx-0 max-w-none text-[clamp(1.05rem,2.8vw,3rem)] font-ergon-light leading-[1.05] mb-5 xl:mb-6"
              style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
            >
              {productName}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={`mx-0 text-[clamp(0.86rem,1.14vw,1.2rem)] leading-relaxed max-w-[32rem] font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
            >
              {productDescription}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto flex min-h-[calc(100dvh-8rem)] w-full max-w-[min(88rem,calc(100vw-2.5rem))] flex-col justify-end text-left xl:max-w-[92rem]"
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.97, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="grid w-full translate-x-8 grid-cols-[minmax(20rem,28rem)_minmax(24rem,1fr)] items-end gap-x-10 px-2 py-8 pb-28 xl:translate-x-10 xl:grid-cols-[minmax(22rem,30rem)_minmax(28rem,1fr)] xl:gap-x-14 xl:px-0 xl:py-10 xl:pb-16"
          >
            <div className="flex h-full flex-col justify-end pl-14 xl:pl-20">
              <div className="ml-6 w-full max-w-[24rem] xl:ml-8">
                <h2 className={cn(
                  "w-full max-w-[24rem] text-center text-[clamp(1.8rem,3vw,3.4rem)] font-light tracking-wide mb-1",
                  isDark ? "text-[#FFF8F0]" : "text-[#2B1810]",
                )}>
                  {selectedPurchase.price.replace(' CHF (IVA incl.)', '')} CHF
                </h2>
                <p className={cn(
                  "w-full max-w-[24rem] text-center text-[clamp(0.72rem,0.95vw,1rem)] font-light mb-4",
                  isDark ? "text-[#E9DAC7]/90" : "text-[#2B1810]/65",
                )}>
                  {t('ui.product.vatIncluded')}
                </p>

                <div className="mb-4 w-full overflow-x-auto pb-1">
                  <div className="flex min-w-max flex-nowrap justify-start gap-1.5">
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
                          "whitespace-nowrap px-2 py-1.5 text-[0.72rem] transition-all duration-300 outline-none focus-visible:outline-none focus-visible:ring-0",
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
                </div>

                {selectedPurchase.note ? (
                  <p className={cn(
                    "mb-4 w-full max-w-[24rem] text-center whitespace-pre-line text-[clamp(0.68rem,0.85vw,0.92rem)] leading-relaxed font-ergon-light",
                    isDark ? "text-[#F3E6D6]" : "text-[#2B1810]/78"
                  )}>
                    {selectedPurchase.note}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={cn(
                    "w-full max-w-[24rem] disabled:opacity-70 py-2.5 px-4 flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_10px_24px_rgba(0,0,0,0.06)] outline-none focus-visible:outline-none focus-visible:ring-0",
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
                  <div className="flex min-w-max flex-nowrap items-center justify-start gap-3 px-1">
                    {purchaseHighlights.map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 whitespace-nowrap",
                          isDark ? "text-[#E6D7C6]/92" : "text-[#2B1810]/78"
                        )}
                      >
                        <Icon size={14} strokeWidth={1.1} />
                        <span className="text-[clamp(0.56rem,0.72vw,0.72rem)] font-normal">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className={cn(
                  "mt-6 w-full max-w-[24rem] text-center text-[clamp(0.68rem,0.82vw,0.92rem)] tracking-[0.15em] uppercase opacity-90 font-light",
                  isDark ? "text-[#DCCFBE]" : "text-[#5D4A3A]"
                )}>
                  {t('ui.product.responsibly')}
                </p>
              </div>
            </div>

            <div className="product-scene-media flex h-full items-end justify-center pb-2">
              <div className="w-full max-w-[36rem]">
                <div className={cn("flex items-center justify-center", desktopMediaStageClass)}>
                  {renderProductMedia(
                    desktopMediaClass,
                    desktopMediaImageClass,
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
