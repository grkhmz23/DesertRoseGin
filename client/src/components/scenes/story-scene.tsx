import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Compass, Sparkles } from 'lucide-react';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

const StoryContent = () => {
  return (
    <div className='max-w-5xl mx-auto'>
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Compass className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Swiss Craftsmanship</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">CRAFTING DISTINCTION</h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          The Desert Rose Gin Co. blends Swiss precision with atypical botanicals. A venture born from the vision of friends committed to crafting high-quality gin inspired by distant worlds.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Sparkles className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Opulent Escape</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">SAHARAN INSPIRED</h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          Infused with desert dates, this gin is an opulent escape. Carefully crafted and distilled in Switzerland through a small-batch production process using discerning organic botanicals.
        </p>
      </div>
    </div>
  );
};

export function StoryScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  useEffect(() => {
    if (isActive) {
      window.scrollTo(0, 0);
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414898-64867308-544x488x551x827x6x115-section-02-image.jpg"
      bgImageSrc="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1920"
      title="OUR STORY"
      subtitle="Swiss Craftsmanship"
      scrollToExpand="SCROLL TO DISCOVER"
    >
      <StoryContent />
    </ScrollExpandMedia>
  );
}
