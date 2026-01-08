import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AnimatedText } from '@/components/ui/animated-text';
import { LiveBottle } from '@/components/ui/live-bottle';
import { AcquireButton } from '@/components/ui/acquire-button';

export interface ProductData {
  id: string;
  name: string;
  year: string;
  batch: string;
  abv: string;
  description: string;
  botanicals: string[];
  bottleImage: string;
}

interface ProductSceneProps {
  data: ProductData;
  isActive: boolean;
  direction: number;
}

export function ProductScene({ data, isActive, direction }: ProductSceneProps) {
  const { t } = useTranslation('common');
  const isDark = data.id === 'limited';
  
  // Get translated product data
  const productKey = data.id === 'classic' ? 'products.classic' : 'products.limited';
  const productName = t(`${productKey}.name`);
  const productYear = t(`${productKey}.year`);
  const productBatch = t(`${productKey}.batch`);
  const productDescription = t(`${productKey}.description`);
  const orderButton = t(`${productKey}.button`);
  
  // Get translated botanicals
  const botanicals = data.id === 'classic' 
    ? [
        t('products.classic.botanicals.sage'),
        t('products.classic.botanicals.saffron'),
        t('products.classic.botanicals.juniper'),
        t('products.classic.botanicals.rosehip')
      ]
    : [
        t('products.limited.botanicals.date'),
        t('products.limited.botanicals.tea'),
        t('products.limited.botanicals.lemon'),
        t('products.limited.botanicals.orange')
      ];

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
          {/* Year Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className={`inline-block px-4 py-1.5 border ${isDark ? 'border-[#CD7E31] text-[#CD7E31]' : 'border-[#2B1810] text-[#2B1810]'} text-xs font-ergon tracking-[0.2em] uppercase`}
          >
            {productYear}
          </motion.div>

          {/* Product Name */}
          <AnimatedText
            text={productName}
            className={`text-4xl md:text-5xl lg:text-6xl font-lux leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
            delay={0.6}
          />

          {/* Batch Info */}
          <p className={`text-sm font-ergon tracking-[0.15em] uppercase ${isDark ? 'text-[#F5EFE6]/70' : 'text-[#2B1810]/70'}`}>
            {productBatch}
          </p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-base md:text-lg leading-relaxed max-w-lg font-ergon ${isDark ? 'text-[#F5EFE6]/80' : 'text-[#2B1810]/80'}`}
          >
            {productDescription}
          </motion.p>

          {/* Botanicals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-3"
          >
            <h3 className={`text-xs font-ergon tracking-[0.2em] uppercase ${isDark ? 'text-[#CD7E31]' : 'text-[#2B1810]'}`}>
              Botanicals
            </h3>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {botanicals.map((botanical, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-ergon border ${
                    isDark 
                      ? 'border-[#F5EFE6]/30 text-[#F5EFE6]/70' 
                      : 'border-[#2B1810]/30 text-[#2B1810]/70'
                  }`}
                >
                  {botanical}
                </span>
              ))}
            </div>
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

        {/* Right Side - Bottle */}
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
          <LiveBottle
            src={data.bottleImage}
            alt={productName}
            isActive={isActive}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
