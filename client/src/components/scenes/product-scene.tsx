import { motion } from 'framer-motion';
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
  const isDark = data.id === 'limited';

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
        ) : (
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#dcbca0] opacity-30 skew-y-6 transform origin-bottom-left" />
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center justify-center pt-20 md:pt-0">
        {/* Info section */}
        <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }} transition={{ delay: 0.5, duration: 0.8 }}>
            <div className={`font-ergon text-[10px] md:text-xs tracking-widest mb-2 md:mb-4 border-l-2 pl-3 md:pl-4 ${isDark ? 'border-[#CD7E31] text-gray-400' : 'border-[#917D37] text-gray-600'}`}>
              BATCH NO. {data.batch} / {data.abv}
            </div>

            {isActive ? (
              <AnimatedText
                text={data.name}
                variant="fade-up"
                className={`text-3xl md:text-5xl lg:text-6xl font-lux mb-3 md:mb-6 leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}
                staggerDelay={0.04}
                initialDelay={0.3}
                tag="h2"
              />
            ) : (
              <h2 className={`text-3xl md:text-5xl lg:text-6xl font-lux mb-3 md:mb-6 leading-tight ${isDark ? 'text-[#F5EFE6]' : 'text-[#2B1810]'}`}>
                {data.name}
              </h2>
            )}

            <p className={`text-xs md:text-base leading-relaxed mb-4 md:mb-8 font-ergon ${isDark ? 'text-[#F5EFE6]/90' : 'text-[#4E3022]'}`}>
              {data.description}
            </p>

            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8">
              {data.botanicals.map((b, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-[color:var(--drg-accent)]' : 'bg-[#917D37]'}`} />
                  <span className={`font-ergon text-[10px] md:text-xs uppercase ${isDark ? 'text-[#F5EFE6]/70' : 'text-[#4E3022]/80'}`}>{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-row items-center gap-3 md:gap-6">
              <AcquireButton label="Order" data-testid={`button-acquire-${data.id}`} />
            </div>
          </motion.div>
        </div>

        {/* Bottle */}
        <div className="w-full md:w-1/3 order-1 md:order-2 h-[30vh] md:h-[70vh] flex items-center justify-center relative">
          <motion.div 
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ delay: 0.2, duration: 1, type: "spring" }}
          >
            <LiveBottle
              src={data.bottleImage}
              alt={data.name}
              className="h-full w-full"
            />
          </motion.div>
        </div>

        {/* Year */}
        <div className="hidden md:block w-1/3 order-3 relative h-full">
          <motion.div 
            className="absolute top-1/4 right-16 md:right-24" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: isActive ? 0.2 : 0 }} 
            transition={{ delay: 0.8 }}
          >
            <h3 className={`text-9xl font-lux writing-vertical-rl ${isDark ? 'text-white' : 'text-[#2B1810]'}`}>{data.year}</h3>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}