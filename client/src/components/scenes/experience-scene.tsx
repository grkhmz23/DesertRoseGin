import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

// Local images
const imgExp1 = "/assets/Experience/experience1.jpg";
const imgExp2 = "/assets/Experience/experience2.jpg";
const imgExp3 = "/assets/Experience/experience3.jpg";
const imgExp4 = "/assets/Experience/experience4.jpg";

export function ExperienceScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const timelineData = [
    {
      title: "INDULGE IN AN OPULENT ESCAPE",
      subtitle: "Balance & Asymmetry",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-4">
            Like the enchanting creation of the rose stone in the Saharan desert evaporation of mineral-rich water, our Gin is crafted in a meticulous distillation process with botanicals that brings you beyond the ordinary.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            The graceful equilibrium of balance and asymmetry, the interplay of smoothness and sharpness, and the hypnotic fusion of undulating waves and sharp edges.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgExp1} alt="Balance & Asymmetry" className="object-cover h-48 md:h-64 w-full" />
            <img src={imgExp2} alt="Desert Rose Experience" className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "INTRIGUE THE PALATE",
      subtitle: "Palate Prestige",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            Set out on a journey of taste that invites you to indulge in a world of unparalleled flavors and inspirations. This master botanical blend pairs perfectly and enriches the precious flavor of gourmet dishes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgExp3} alt="Intrigue the Palate" className="object-cover h-48 md:h-64 w-full" />
            <img src={imgExp4} alt="Gourmet Experience" className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "REDEFINE VERSATILITY",
      subtitle: "Versatility",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            From rocks to mixology, you can explore various dimensions. Our gin adapts to every desire.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgExp1} alt="Versatility" className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-[#2B1810] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810] via-[#1a100a] to-[#2B1810]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#F5EFE6]/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-10 px-4 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-[#F5EFE6] font-ergon text-[10px] tracking-[0.3em] uppercase">Saharan Inspired</span>
          <h2 className="text-4xl md:text-6xl font-lux text-[#F5EFE6] mt-4 mb-6">THE EXPERIENCE</h2>
          <p className="text-[#F5EFE6]/60 text-sm md:text-base max-w-xl font-ergon">
            Discover the artistry behind every sip, where Swiss precision meets desert mystique.
          </p>
        </motion.div>
      </div>
      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </motion.div>
  );
}
