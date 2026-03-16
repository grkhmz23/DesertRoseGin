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
  const desktopTitleColor = isDark ? "text-[#F3EFE7]" : "text-[#2B1810]";
  const desktopDescriptionColor = "text-[#F3EFE7]";
  const mobileTitleColor = isDark ? "text-[#F3EFE7]" : "text-[#2B1810]";
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

  const bottleStageClass = cn(
    "w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[360px] xl:max-w-[410px] 2xl:max-w-[440px]",
  );

  const desktopBottleStageClass = cn(
    bottleStageClass,
    "lg:max-w-[648px] xl:max-w-[738px] 2xl:max-w-[792px]",
  );

  const desktopImageClass = cn(
    "h-auto max-h-[104vh] w-auto max-w-full object-contain lg:max-h-[115vh] xl:max-h-[122vh]",
    isBoxSelection ? "translate-y-[-8%]" : "",
  );

  const mobileImageClass = cn(
    "h-auto max-h-[30vh] w-auto max-w-full object-contain",
    isBoxSelection ? "translate-y-[-5%]" : "",
  );

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
        ) : (
          <picture className="block w-full h-full">
            <source media="(max-width: 768px)" srcSet={classicBackgroundMobile} />
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

      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,46,27,0.6)_0%,transparent_70%)]" />
        <div className="absolute inset-x-[5vw] top-1/2 hidden -translate-y-1/2 items-center justify-between opacity-[0.08] mix-blend-overlay lg:flex">
          <span className={cn(
            "font-lux text-[14vw] leading-none tracking-[-0.08em]",
            isDark ? "text-[#F3EFE7]" : "text-[#2B1810]",
          )}>
            DESERT
          </span>
          <span className={cn(
            "font-lux text-[14vw] leading-none tracking-[-0.08em]",
            isDark ? "text-[#F3EFE7]" : "text-[#2B1810]",
          )}>
            ROSE
          </span>
        </div>
      </div>

      <div className="product-scene-inner relative z-10 h-[100dvh] w-full overflow-hidden px-5 pt-20 pb-5 sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-8 lg:py-10 xl:px-12 2xl:px-16">
        <div className="lg:hidden flex h-full min-h-0 flex-col gap-4 pt-2">
          <div className="flex items-start justify-end gap-4 pt-1">
            <div className={cn(
              "text-right text-[1.35rem] leading-none",
              isDark ? "text-[#F3EFE7]" : "text-[#2B1810]",
            )}>
              {displayPrice}
            </div>
          </div>

          <div className="relative z-20 flex-shrink-0 pt-1">
            <h1 className={cn(
              "max-w-[90%] font-ergon-light text-[2.3rem] leading-[0.95] tracking-tight",
              mobileTitleColor,
            )}>
              {productName}
            </h1>
            <p className={cn(
              "mt-3 max-w-[85%] text-xs leading-relaxed font-ergon-light",
              mobileDescriptionColor,
            )}>
              {productDescription}
            </p>
          </div>

          <div className="relative flex min-h-[210px] flex-1 items-center justify-center pointer-events-none">
            <div className={bottleStageClass}>
              {renderProductMedia("w-full", mobileImageClass)}
            </div>
          </div>

          <div className={cn(
            "relative z-20 flex-shrink-0 rounded-[1.25rem] border p-4 shadow-2xl backdrop-blur-sm",
            isDark
              ? "border-[#F3EFE7]/10 bg-[#141110]/20 text-[#F3EFE7]"
              : "border-[#2B1810]/10 bg-[#f3efe7]/20 text-[#2B1810]",
          )}>
            <div className="flex items-center justify-between gap-4 px-1">
              <div className={cn(
                "text-[0.58rem] uppercase tracking-[0.24em]",
                isDark ? "text-[#F3EFE7]/44" : "text-[#2B1810]/44",
              )}>
                {productName}
              </div>
              <div className={cn(
                "text-[0.58rem] uppercase tracking-[0.24em]",
                isDark ? "text-[#F3EFE7]/44" : "text-[#2B1810]/44",
              )}>
                {t('ui.product.vatIncluded')}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {purchaseOptions.map((purchaseOption, index) => {
                const isSelected = selectedPurchaseIndex === index;
                const optionNumber = String(index + 1).padStart(2, '0');

                return (
                  <button
                    key={purchaseOption.size}
                    type="button"
                    onClick={() => selectPurchase(index, purchaseOption.isBox)}
                    className={cn(
                      "min-h-[3.25rem] border px-2 py-2 text-center transition-colors duration-300",
                      isSelected
                        ? isDark
                          ? "border-[#D4A373] bg-[#D4A373]/10 text-[#D4A373]"
                          : "border-[#8A5A44] bg-[#8A5A44]/10 text-[#8A5A44]"
                        : isDark
                          ? "border-[#F3EFE7]/10 text-[#F3EFE7]/64"
                          : "border-[#2B1810]/10 text-[#2B1810]/64"
                    )}
                  >
                    <span className={cn(
                      "mb-1 block text-[10px] font-light uppercase tracking-[0.24em]",
                      isSelected
                        ? isDark
                          ? "text-[#D4A373]"
                          : "text-[#8A5A44]"
                        : isDark
                          ? "text-[#F3EFE7]/44"
                          : "text-[#2B1810]/44",
                    )}>
                      {optionNumber}
                    </span>
                    <span className="block text-xs font-light uppercase tracking-[0.16em] leading-tight">{purchaseOption.size}</span>
                  </button>
                );
              })}
            </div>

            {selectedPurchase.note ? (
              <p className={cn(
                "mt-4 whitespace-pre-line text-[0.68rem] leading-relaxed font-ergon-light",
                isDark ? "text-[#F3EFE7]/74" : "text-[#2B1810]/74",
              )}>
                {selectedPurchase.note}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading}
              className={cn(
                "mt-4 flex w-full items-center justify-center gap-2 rounded-md py-3.5 text-[0.72rem] font-light uppercase tracking-[0.22em] transition-transform active:scale-[0.98]",
                isDark
                  ? "bg-[#F3EFE7] text-[#0D0B0A]"
                  : "bg-[#2B1810] text-[#F3EFE7]"
              )}
            >
              <ShoppingCart size={16} />
              <span>{addToCartLabel}</span>
            </button>

            <div className={cn(
              "mt-3 text-center text-[11px] font-light uppercase tracking-[0.18em]",
              isDark ? "text-[#F3EFE7]/55" : "text-[#2B1810]/55",
            )}>
              {t('ui.product.responsibly')}
            </div>

            <div className={cn(
              "mt-4 flex items-center justify-between gap-2 border-t pt-4",
              isDark ? "border-[#F3EFE7]/10" : "border-[#2B1810]/10",
            )}>
              <div className={cn(
                "flex items-center gap-1.5",
                isDark ? "text-[#F3EFE7]/52" : "text-[#2B1810]/52",
              )}>
                <Sparkles size={12} className={isDark ? "text-[#D4A373]" : "text-[#8A5A44]"} />
                <span className="text-[11px] font-light uppercase tracking-[0.18em]">{t('ui.product.highlights.distilled')}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1.5",
                isDark ? "text-[#F3EFE7]/52" : "text-[#2B1810]/52",
              )}>
                <ShieldCheck size={12} className={isDark ? "text-[#D4A373]" : "text-[#8A5A44]"} />
                <span className="text-[11px] font-light uppercase tracking-[0.18em]">{t('ui.product.highlights.secure')}</span>
              </div>
              <div className={cn(
                "flex items-center gap-1.5",
                isDark ? "text-[#F3EFE7]/52" : "text-[#2B1810]/52",
              )}>
                <Truck size={12} className={isDark ? "text-[#D4A373]" : "text-[#8A5A44]"} />
                <span className="text-[11px] font-light uppercase tracking-[0.18em]">{t('ui.product.highlights.shipping')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden h-full lg:block">
          <div className="relative mx-auto grid h-full max-w-[1800px] grid-cols-12 grid-rows-[auto_1fr_auto] gap-8 px-2 pt-4 pb-6 pr-20 xl:px-6 xl:pr-24 2xl:pr-28">
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
                className="col-span-4 flex flex-col justify-center xl:col-span-4"
              >
                <h1 className={cn(
                  "max-w-[28rem] font-ergon-light text-5xl leading-[1.02] tracking-tight xl:text-6xl 2xl:text-7xl",
                  desktopTitleColor,
                )}>
                  {productName}
                </h1>
                <p className={cn(
                  "mt-6 max-w-sm text-sm leading-relaxed font-ergon-light xl:text-base",
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
                className="pointer-events-none col-span-4 flex items-center justify-center xl:col-span-4"
              >
                <div className={cn("flex w-full items-center justify-center", desktopBottleStageClass)}>
                  {renderProductMedia("w-full", desktopImageClass)}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.28 }}
                className="col-span-4 flex flex-col justify-center items-end xl:col-span-4"
              >
                <div className={cn(
                  "w-full max-w-[320px] border p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm xl:max-w-[360px] xl:p-8",
                  isDark
                    ? "border-[#F3EFE7]/10 bg-[#141110]/20 text-[#F3EFE7]"
                    : "border-[#2B1810]/10 bg-[#f3efe7]/20 text-[#2B1810]",
                )}>
                  <div className={cn(
                    "mb-7 border-b pb-6",
                    isDark ? "border-[#F3EFE7]/10" : "border-[#2B1810]/10",
                  )}>
                    <div className={cn(
                      "font-lux text-4xl leading-none xl:text-5xl",
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
                      const optionNumber = String(index + 1).padStart(2, '0');

                      return (
                        <button
                          key={purchaseOption.size}
                          type="button"
                          onClick={() => selectPurchase(index, purchaseOption.isBox)}
                          className={cn(
                            "flex w-full items-center justify-between border px-4 py-4 text-left transition-all duration-300",
                            isSelected
                              ? isDark
                                ? "border-[#D4A373] bg-[#D4A373]/10 text-[#F3EFE7]"
                                : "border-[#8A5A44] bg-[#8A5A44]/10 text-[#2B1810]"
                              : isDark
                                ? "border-[#F3EFE7]/10 text-[#F3EFE7]/64 hover:border-[#F3EFE7]/28"
                                : "border-[#2B1810]/10 text-[#2B1810]/64 hover:border-[#2B1810]/25"
                          )}
                        >
                          <span className="flex items-center gap-3 pr-4">
                            <span className={cn(
                              "text-[11px] font-light uppercase tracking-[0.24em]",
                              isSelected
                                ? isDark
                                  ? "text-[#D4A373]"
                                  : "text-[#8A5A44]"
                                : isDark
                                  ? "text-[#F3EFE7]/44"
                                  : "text-[#2B1810]/44",
                            )}>
                              {optionNumber}
                            </span>
                            <span className="text-sm font-light uppercase tracking-[0.18em]">{purchaseOption.size}</span>
                          </span>
                          <span className={cn(
                            "text-[10px] font-light uppercase tracking-[0.18em]",
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
                      "mt-7 flex w-full items-center justify-between px-5 py-4 transition-colors duration-300",
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
                    "mt-5 border-t pt-4 space-y-3",
                    isDark ? "border-[#F3EFE7]/10" : "border-[#2B1810]/10",
                  )}>
                    {purchaseHighlights.map(({ icon: Icon, text }) => (
                      <div
                        key={text}
                        className={cn(
                          "flex items-center gap-3",
                          panelTextTone,
                        )}
                      >
                        <Icon size={15} className={isDark ? "text-[#D4A373]" : "text-[#8A5A44]"} />
                        <span className="text-[11px] font-light uppercase tracking-[0.18em]">{text}</span>
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
