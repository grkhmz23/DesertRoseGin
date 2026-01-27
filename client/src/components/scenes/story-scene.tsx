import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

// Local optimized images
const imgCover = "/assets/our_story/cover-card.jpg";
const imgStory1 = "/assets/our_story/story-1.jpg";
const imgStory2 = "/assets/our_story/story-2.jpg";
const imgStory3 = "/assets/our_story/story-3.jpg";
const imgStory4 = "/assets/our_story/story-4.jpg";
const imgStory5 = "/assets/our_story/story-5.jpg";
const imgStory6 = "/assets/our_story/story-6.jpg";

export function StoryScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const timelineData = [
    {
      title: "CRAFTING DISTINCTION",
      subtitle: "Swiss Craftsmanship",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgStory1} alt="Swiss Craftsmanship" className="object-cover h-48 md:h-64 w-full" />
            <img src={imgStory2} alt="Distillery" className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "SAHARAN INSPIRED",
      subtitle: "Opulent Escape",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process using discerning organic botanicals.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgStory3} alt="Botanicals" className="object-cover h-48 md:h-64 w-full" />
            <img src={imgStory4} alt="Ingredients" className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "THE FOUNDERS",
      subtitle: "Our Vision",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-8">
            Born from friendship and a shared passion for exceptional spirits, our founders set out to create something extraordinary — a gin that tells a story with every sip.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgStory5} alt="Founders" className="object-cover h-48 md:h-64 w-full" />
            <img src={imgStory6} alt="Team" className="object-cover h-48 md:h-64 w-full" />
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
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#F5EFE6]/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto pt-24 pb-10 px-4 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-[#F5EFE6] font-ergon text-[10px] tracking-[0.3em] uppercase">Discover Our Origins</span>
          <h2 className="text-4xl md:text-6xl font-lux text-[#F5EFE6] mt-4 mb-6">OUR STORY</h2>
          <p className="text-[#F5EFE6]/60 text-sm md:text-base max-w-xl font-ergon">
            A journey from Swiss precision to Saharan inspiration, crafting gin that transcends ordinary.
          </p>
        </motion.div>
      </div>
      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </motion.div>
  );
}
