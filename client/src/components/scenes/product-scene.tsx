import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { AnimatedText } from '@/components/ui/animated-text';
import { LiveBottle } from '@/components/ui/live-bottle';
import { AcquireButton } from '@/components/ui/acquire-button';
import { RockingBottle } from "@/components/ui/rocking-bottle";

// NEW: Product option interface for pricing
export interface ProductOption {
  size: string;
  price: string;
  image: string;
  video?: string;
}

export interface ProductData {
  id: string;
  name: string;
  batch: string;
  abv: string;
  description: string;
  options: ProductOption[];
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

  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';
  const productName = t(`${productKey}.name`);
  const productBatch = t(`${productKey}.batch`);
  const productDescription = t(`${productKey}.description`);
  const orderButton = t(`${productKey}.button`);

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center overflow-hidden scene-locked ${isDark ? 'bg-[#2B1810]' : 'bg-[#E8DCCA]'}`}
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
          <img 
            src="/backgrounds/limited-bg.webp" 
            alt="Limited Edition Background" 
            className="w-full h-full object-cover" 
            draggable={false} 
          />
        ) : data.id === 'classic' ? (
          <img 
            src="/backgrounds/classic-bg.webp" 
            alt="Classic Edition Background" 
            className="w-full h-full object-cover" 
            draggable={false}
          />
        ) : null}
        <div className={`absolute inset-0 ${isDark ? 'bg-[#2B1810]/40' : 'bg-[#E8DCCA]/40'}`} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-12 md:py-20">

        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left"
        >
          {/* NO YEAR BADGE - REMOVED */}

          {/* Product Name */}
          <AnimatedText
            text={productName}
            className={`text-4xl md:text-5xl lg:text-6xl font-lux leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
            delay={0.6}
          />

          {/* Batch Info - BRIGHTER TEXT */}
          <p className={`text-sm font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
            {productBatch}
          </p>

          {/* Description - BRIGHTER TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-base md:text-lg leading-relaxed max-w-lg font-ergon-light ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
          >
            {productDescription}
            {data.options[selectedOption].size === "Gift Box Set" && (
              <span className="block mt-3 text-sm opacity-80">
                Dimensions: 278 x 212 x 190 cm (L x W x H) • Capacity: 6 Bottles per Box
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
            {data.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={cn(
                  "w-full md:w-auto flex items-center justify-between px-5 py-3 border transition-all duration-300",
                  selectedOption === index 
                    ? isDark 
                      ? "border-[#F5EFE6] bg-[#F5EFE6]/10" 
                      : "border-[#2B1810] bg-[#2B1810]/10"
                    : isDark 
                      ? "border-[#F5EFE6]/30 hover:border-[#F5EFE6]/60" 
                      : "border-[#2B1810]/30 hover:border-[#2B1810]/60"
                )}
              >
                <span className={`font-ergon-light text-sm uppercase tracking-wider ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                  {option.size}
                </span>
                <span className={`font-lux text-xl ml-6 ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                  {option.price.replace('(IVA incl.)', '')}<span className="text-[10px] opacity-60 ml-1">(IVA incl.)</span>
                </span>
              </button>
            ))}
          </motion.div>

          {/* Order Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <AcquireButton isDark={isDark} label={orderButton} />
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
          className="w-full md:w-1/2 flex items-center justify-center mt-8 md:mt-0"
        >
          {data.options[selectedOption].video ? (
            <RockingBottle
              src={data.options[selectedOption].video}
              alt={productName}
              isActive={isActive}
              className="max-h-[70vh]"
            />
          ) : (
            <LiveBottle
              src={data.options[selectedOption].image}
              alt={productName}
              isActive={isActive}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}