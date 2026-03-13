import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart';
import { getShopifyVariantId } from '@/lib/shopify/products';
import { ShoppingCart, Sparkles, Shield, Truck } from 'lucide-react';

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

interface ProductSceneMobileProps {
  data: ProductData;
  isActive: boolean;
}

const purchaseHighlights = [
  { icon: Sparkles, text: 'Small batch distilled in Switzerland' },
  { icon: Shield, text: 'Secure checkout' },
  { icon: Truck, text: 'Shipping 2-4 days' },
];

export function ProductSceneMobile({ data, isActive }: ProductSceneMobileProps) {
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

  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';
  const productName = t(`${productKey}.name`);
  const productDescription = t(`${productKey}.description`);
  const addToCartLabel = 'Add to Cart';

  const handleAddToCart = async () => {
    const priceString = selectedPurchase.price.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceString);
    
    if (isNaN(price)) {
      console.error('Invalid price format:', selectedPurchase.price);
      return;
    }
    
    const lookupSize = selectedPurchase.shopifyLookupSize || selectedPurchase.size;
    const variantId = option.shopifyVariantId || getShopifyVariantId(data.id, lookupSize);
    
    await addItem({
      id: variantId || `${data.id}-${lookupSize}`,
      name: data.name,
      variant: selectedPurchase.size,
      price: price,
      image: selectedPurchase.image,
      handle: data.shopifyHandle || data.id,
    });
  };

  // Simple fade-in using CSS instead of Framer Motion
  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center px-4 pt-16 pb-4"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Title */}
      <div className="text-center mb-2 animate-fade-in">
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
  );
}
