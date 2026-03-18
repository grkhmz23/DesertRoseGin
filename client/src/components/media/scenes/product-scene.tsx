import { useState } from 'react';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { LiveBottle } from '@/components/ui/live-bottle';
import { useCart } from '@/components/cart';
import { RockingBottle } from "@/components/ui/rocking-bottle";
import { getShopifyVariantId } from '@/lib/shopify/products';
import { Droplets, ShieldCheck, ShoppingCart, Sparkles, Truck } from 'lucide-react';

const limitedBackgroundDesktop = "/backgrounds/limited-bg.webp";
const limitedBackgroundMobile = "/backgrounds/limited-bg-mobile.webp";
const classicBackgroundDesktop = "/backgrounds/classic-bg.webp";
const classicBackgroundMobile = "/backgrounds/classic-bg-mobile.webp";

export interface ProductOption {
  size: string;
  price: string;
  image: string;
  video?: string;
  shopifyVariantId?: string;
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
  const isBoxSelection = isSixBottleBoxSelected;

  const purchaseHighlights = [
    { icon: Sparkles, text: t('ui.product.highlights.distilled') },
    { icon: ShieldCheck, text: t('ui.product.highlights.secure') },
    { icon: Truck, text: t('ui.product.highlights.shipping') },
  ];

  const handleAddToCart = async () => {
    const priceString = selectedPurchase.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceString);

    if (isNaN(price)) {
      console.error('Invalid price format:', selectedPurchase.price);
      return;
    }

    const lookupSize = selectedPurchase.shopifyLookupSize || selectedPurchase.size;
    const variantId = option.shopifyVariantId || getShopifyVariantId(data.id, lookupSize);

    if (!variantId) {
      console.warn('No Shopify variant ID found for:', data.id, lookupSize);
    }

    await addItem({
      id: variantId || `${data.id}-${lookupSize}`,
      name: data.name,
      variant: selectedPurchase.size,
      price,
      image: selectedPurchase.image,
      handle: data.shopifyHandle || data.id,
    });
  };

  const selectPurchase = (index: number, isBox?: boolean) => {
    if (isBox) {
      setIsSixBottleBoxSelected(true);
      return;
    }

    setSelectedOption(index);
    setIsSixBottleBoxSelected(false);
  };

  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';
  const productName = t(`${productKey}.name`);
  const productDescription = t(`${productKey}.description`);
  const addToCartLabel = t('ui.product.addToCart');
  const displayPrice = selectedPurchase.price.replace(' (IVA incl.)', '');
  const productNameParts = productName.split(' ');
  const titleLine1 = productNameParts.slice(0, 3).join(' ');
  const titleLine2 = productNameParts.slice(3).join(' ');
  const desktopTitleColor = isDark ? "text-[#F3EFE7]" : "text-[#2B1810]";
  const desktopDescriptionColor = "text-[#F3EFE7]";
  const mobileTitleColor = "text-[#F3EFE7]";
  const mobileDescriptionColor = "text-[#F3EFE7]";
  const panelTextTone = isDark ? "text-[#F3EFE7]/72" : "text-[#2B1810]/62";

  const renderProductMedia = (className?: string, imageClassName?: string) => {
    if (option.video && !isSixBottleBoxSelected) {
      return (
        <RockingBottle
          src={option.video}
          alt={productName}
          isActive={isActive}
          className={className}
        />
      );
    }

    return (
      <LiveBottle
        src={selectedPurchase.image}
        alt={productName}
        isActive={isActive}
        className={className}
        imageClassName={imageClassName}
      />
    );
  };

  const desktopBottleStageClass = cn(
    "w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[842px] xl:max-w-[959px] 2xl:max-w-[1030px]",
  );

  // Fix D: cap bottle height to stay within the visible scene frame.
  // Previous values (149vh / 159vh) allowed the bottle element to extend
  // far beyond the viewport, which could cause grid-cell overflow on short screens.
  const desktopImageClass = cn(
    "h-auto max-h-[88vh] w-auto max-w-full object-contain lg:max-h-[96vh] xl:max-h-[100vh]",
    isBoxSelection ? "translate-y-[-4%]" : "",
  );

  return (
    <motion.div
      className={`absolute inset-0 flex items-start justify-start overflow-hidden lg:items-center lg:justify-center scene-locked ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: isActive ? '0%' : direction > 0 ? '-100%' : '100%', opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`scene-product-${data.id}`}
      data-scene-type="locked"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div className="absolute inset-0 w-full h-full">
        {isDark ? (
          <picture className="block w-full h-full">
            <source media="(max-width: 1023px)" srcSet={limitedBackgroundMobile} />
            <img
              src={limitedBackgroundDesktop}
              alt="Limited Edition Background"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </picture>
        ) : (
          <picture className="block w-full h-full">
            <source media="(max-width: 1023px)" srcSet={classicBackgroundMobile} />
            <img
              src={classicBackgroundDesktop}
              alt="Classic Edition Background"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </picture>
        )}
        <div className={`absolute inset-0 ${isDark ? 'bg-[#110d0a]/55' : 'bg-[#1c140f]/28'}`} />
      </div>

      <div className="product-scene-inner relative z-10 h-[100dvh] w-full overflow-hidden px-4 pt-20 pb-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))] sm:px-5 sm:pt-24 md:px-8 md:pt-28 lg:px-8 lg:py-10 xl:px-12 2xl:px-16">
        <div className="lg:hidden flex h-full w-full flex-col items-center justify-center px-1 pt-1">
          {/* Mobile (< 768px): narrow centered column | Tablet (768-1023px): two-column side-by-side */}
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-between px-3 py-3",
              "min-[360px]:px-4 min-[360px]:py-4",
              "md:flex-row md:items-center md:justify-center md:gap-8 md:px-10 md:py-6 md:max-w-4xl",
              "text-[#F3EFE7]",
            )}
          >
            {/* Left column on tablet: title + bottle */}
            <div className="md:flex md:flex-1 md:flex-col md:items-center md:justify-center w-full">
              <div className="w-full shrink text-center">
                {/* Fix A (mobile): remove whitespace-nowrap so locale-specific strings can
                    wrap gracefully rather than overflowing narrow screens */}
                <h1 className={cn(
                  "mx-auto font-ergon-light text-[clamp(0.9rem,4.2vw,1.15rem)] leading-[1.1] tracking-tight",
                  "md:text-2xl",
                  mobileTitleColor,
                )}>
                  <span className="block">{titleLine1}</span>
                  <span className="block">{titleLine2}</span>
                </h1>
                <p className={cn(
                  "mx-auto mt-2 max-w-[17.25rem] text-[clamp(0.64rem,2.85vw,0.76rem)] leading-[1.45] font-ergon-light",
                  "sm:max-w-sm sm:text-xs md:max-w-sm md:text-sm",
                  mobileDescriptionColor,
                )}>
                  {productDescription}
                </p>
              </div>

              <div className="pointer-events-none flex min-h-0 flex-1 items-center justify-center py-2 md:w-full md:flex-none md:py-4">
                <div className="w-full max-w-[21rem] min-[360px]:max-w-[23rem] min-[400px]:max-w-[25rem] sm:max-w-[27rem] md:max-w-[33rem]">
                  {renderProductMedia("w-full", "h-auto max-h-[52vh] sm:max-h-[58vh] md:max-h-[72vh] w-auto max-w-full object-contain")}
                </div>
              </div>
            </div>

            {/* Right column on tablet: purchase panel | stacked below on mobile */}
            <div className="w-full shrink-0 md:flex-none md:w-auto md:min-w-[280px] md:max-w-[320px]">
              {/* Dark backdrop for Classic on mobile so white text is always readable */}
              <div className={cn(
                "px-4 py-4",
                !isDark && "bg-[#1c140f]/60 backdrop-blur-sm",
              )}>
                <div className="mb-3 flex justify-center">
                  <div className="text-center text-[clamp(1.45rem,6vw,1.9rem)] leading-none md:text-3xl text-[#F3EFE7]">
                    {displayPrice}
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap justify-center gap-1.5 md:gap-2">
                  {purchaseOptions.map((purchaseOption, index) => {
                    const isSelected = selectedPurchaseIndex === index;

                    return (
                      <button
                        key={purchaseOption.size}
                        type="button"
                        onClick={() => selectPurchase(index, purchaseOption.isBox)}
                        className={cn(
                          "whitespace-nowrap border px-2 py-1 text-[clamp(0.52rem,2.2vw,0.68rem)] md:text-[0.68rem] uppercase tracking-[0.12em] transition-all duration-300",
                          isSelected
                            ? isDark
                              ? "border-[#D4A373] bg-[#D4A373]/10 text-[#D4A373]"
                              : "border-[#CD7E31] bg-[#CD7E31]/20 text-[#F3EFE7]"
                            : "border-[#F3EFE7]/30 text-[#F3EFE7]"
                        )}
                      >
                        {purchaseOption.size}
                      </button>
                    );
                  })}
                </div>

                {selectedPurchase.note ? (
                  <p className="mb-3 text-center text-[clamp(0.58rem,2.5vw,0.68rem)] md:text-[0.68rem] leading-relaxed font-ergon-light text-[#F3EFE7]/80">
                    {selectedPurchase.note}
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 py-2.5 md:py-3 text-[clamp(0.62rem,2.6vw,0.74rem)] md:text-xs font-light uppercase tracking-[0.2em] transition-transform active:scale-[0.98]",
                    isDark
                      ? "bg-[#F3EFE7] text-[#0D0B0A]"
                      : "bg-[#2B1810] text-[#F3EFE7]"
                  )}
                >
                  <ShoppingCart size={15} />
                  <span>{addToCartLabel}</span>
                </button>

                <div className="mt-3 text-center text-[clamp(0.56rem,2.35vw,0.68rem)] md:text-[0.62rem] font-light uppercase tracking-[0.16em] text-[#F3EFE7]/70">
                  {t('ui.product.responsibly')}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[#F3EFE7]/15 pt-2">
                  {purchaseHighlights.map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-1 whitespace-nowrap text-[clamp(0.28rem,1.1vw,0.38rem)] md:text-[0.38rem] text-[#F3EFE7]/75"
                    >
                      <Icon size={6} className="text-[#D4A373]" />
                      <span className="font-light uppercase tracking-[0.14em]">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden h-full lg:block">
          {/*
            Fix B: increase right padding at lg from pr-24 (96px) to pr-32 (128px).
            The AltimeterNavGallery is fixed right-8 and extends ~130px inward.
            Old total clearance at lg: outer(32) + inner(96) = 128px → only 0px buffer vs nav.
            New total clearance at lg: outer(32) + inner(128) = 160px → 30px safe buffer.
            xl and 2xl remain unchanged (already had 160px+ clearance).
          */}
          <div className="relative mx-auto grid h-full max-w-[1800px] grid-cols-12 grid-rows-[auto_1fr_auto] gap-8 px-2 pt-4 pb-6 pr-32 xl:px-6 xl:pr-28 2xl:pr-32">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="col-span-12 flex items-start justify-end gap-6"
            >
              <div />
            </motion.div>

            <div className="col-span-12 grid grid-cols-12 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -40 }}
                transition={{ duration: 0.8, delay: 0.24 }}
                className="col-span-3 flex flex-col justify-center self-center -translate-y-4 xl:-translate-y-6 2xl:-translate-y-8"
              >
                {/*
                  Fix A (desktop): replace the 2.1vw-only scaling with a conservative
                  column-aware clamp.

                  Root cause: the i18n product names are ALL-CAPS. Uppercase glyphs
                  are ~15-20% wider than mixed-case. The old 2.1vw font grew faster
                  than the col-span-3 column (which also loses width to the fixed
                  128px right-padding offset), causing the title to overflow into the
                  bottle column at 1024–1440px — especially on Windows where Ergon
                  renders ~5-7% wider than on macOS.

                  New clamp math:
                    min  1.1rem  → safe floor at narrow desktop (~16px at 1024px)
                    mid  1.55vw  → grows proportionally with viewport
                    max  2.6rem  → caps elegantly for large monitors (≈42px at 1920px)

                  Verification ("DESERT ROSE GIN", 15 all-caps chars, ~0.62em/char):
                    1024px → 16px  → ~149px in ~182px col  ✓
                    1280px → 19.8px → ~184px in ~238px col  ✓
                    1440px → 22.3px → ~207px in ~278px col  ✓
                    1728px → 26.8px → ~249px in ~338px col  ✓
                    1920px → 29.8px → ~277px in ~386px col  ✓
                  Italian "EDIZIONE CLASSICA" (17 chars):
                    1280px → 19.8px → ~209px in ~238px col  ✓

                  whitespace-nowrap removed: text can wrap at word boundaries if a
                  future translation is unexpectedly long, rather than overflowing.
                */}
                <h1 className={cn(
                  "font-ergon-light text-[clamp(1.1rem,1.55vw,2.6rem)] leading-[1.08] tracking-tight",
                  desktopTitleColor,
                )}>
                  <span className="block">{titleLine1}</span>
                  <span className="block">{titleLine2}</span>
                </h1>
                <p className={cn(
                  "mt-4 text-[clamp(0.6rem,1vw,0.875rem)] leading-relaxed font-ergon-light",
                  desktopDescriptionColor,
                )}>
                  {productDescription}
                </p>
                {selectedPurchase.note ? (
                  <p className={cn(
                    "mt-5 max-w-sm whitespace-pre-line text-[0.82rem] leading-relaxed font-ergon-light xl:text-[0.9rem]",
                    isDark ? "text-[#F3EFE7]/76" : "text-[#2B1810]/76",
                  )}>
                    {selectedPurchase.note}
                  </p>
                ) : null}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 32, scale: isActive ? 1 : 0.96 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="pointer-events-none col-span-6 flex items-center justify-center"
              >
                <div className={cn("flex w-full items-center justify-center", desktopBottleStageClass)}>
                  {renderProductMedia("w-full", desktopImageClass)}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.28 }}
                className="col-span-3 flex flex-col justify-center items-end pr-4 xl:pr-6 2xl:pr-8"
              >
                <div className={cn(
                  "w-full max-w-[260px] border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm xl:max-w-[300px] xl:p-5 2xl:max-w-[340px] 2xl:p-6",
                  isDark
                    ? "border-[#F3EFE7]/10 bg-[#141110]/20 text-[#F3EFE7]"
                    : "border-[#2B1810]/10 bg-[#f3efe7]/20 text-[#2B1810]",
                )}>
                  <div className={cn(
                    "mb-4 border-b pb-4",
                    isDark ? "border-[#F3EFE7]/10" : "border-[#2B1810]/10",
                  )}>
                    {/* Fix C: font-lux was undefined in tailwind.config.ts, causing
                        the price to silently fall back to the OS default font (Arial
                        on Windows, Helvetica on macOS). Use font-ergon-light so the
                        price renders in the intended Ergon typeface on all platforms. */}
                    <div className={cn(
                      "font-ergon-light text-3xl leading-none xl:text-4xl 2xl:text-5xl",
                      isDark ? "text-[#D4A373]" : "text-[#8A5A44]",
                    )}>
                      {displayPrice}
                    </div>
                    <div className={cn(
                      "mt-2 text-[10px] uppercase tracking-[0.24em]",
                      isDark ? "text-[#F3EFE7]/40" : "text-[#2B1810]/40",
                    )}>
                      {t('ui.product.vatIncluded')}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {purchaseOptions.map((purchaseOption, index) => {
                      const isSelected = selectedPurchaseIndex === index;

                      return (
                        <button
                          key={purchaseOption.size}
                          type="button"
                          onClick={() => selectPurchase(index, purchaseOption.isBox)}
                          className={cn(
                            "flex w-full items-center justify-between border px-3 py-2.5 text-left outline-none transition-all duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                            isSelected
                              ? isDark
                                ? "border-[#D4A373] bg-[#D4A373]/10 text-[#F3EFE7]"
                                : "border-[#8A5A44] bg-[#8A5A44]/10 text-[#2B1810]"
                              : isDark
                                ? "border-[#F3EFE7]/10 text-[#F3EFE7]/64 hover:border-[#F3EFE7]/28"
                                : "border-[#2B1810]/10 text-[#2B1810]/64 hover:border-[#2B1810]/25"
                          )}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="whitespace-nowrap text-xs font-light uppercase tracking-[0.14em]">{purchaseOption.size}</span>
                          </span>
                          <span className={cn(
                            "whitespace-nowrap text-[10px] font-light uppercase tracking-[0.14em] pl-2",
                            isSelected
                              ? isDark
                                ? "text-[#D4A373]"
                                : "text-[#8A5A44]"
                              : isDark
                                ? "text-[#F3EFE7]/44"
                                : "text-[#2B1810]/44",
                          )}>
                            {purchaseOption.price.replace(' (IVA incl.)', '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className={cn(
                      "mt-4 flex w-full items-center justify-between px-4 py-3 transition-colors duration-300",
                      isDark
                        ? "bg-[#F3EFE7] text-[#0D0B0A] hover:bg-[#D4A373]"
                        : "bg-[#2B1810] text-[#F3EFE7] hover:bg-[#4f3f31]"
                    )}
                  >
                    <span className="text-xs font-light uppercase tracking-[0.22em]">{addToCartLabel}</span>
                    <span className="text-lg leading-none">→</span>
                  </button>

                  <div className={cn(
                    "mt-3 text-center text-[11px] font-light uppercase tracking-[0.18em]",
                    isDark ? "text-[#F3EFE7]/55" : "text-[#2B1810]/55",
                  )}>
                    {t('ui.product.responsibly')}
                  </div>

                  <div className={cn(
                    "mt-3 border-t pt-3 space-y-2",
                    isDark ? "border-[#F3EFE7]/10" : "border-[#2B1810]/10",
                  )}>
                    {purchaseHighlights.map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className={cn(
                          "flex items-center gap-1.5",
                          panelTextTone,
                        )}
                      >
                        <Icon size={9} className={isDark ? "text-[#D4A373]" : "text-[#8A5A44]"} />
                        <span className="text-[7px] font-light uppercase tracking-[0.18em]">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
