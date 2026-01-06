import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Scale, Utensils } from 'lucide-react';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

const ExperienceContent = () => {
  return (
    <div className='max-w-5xl mx-auto'>
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Scale className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Balance & Asymmetry</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">HARMONY & EDGE</h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          Like the enchanting mineral in the Saharan desert, our gin beckons you beyond the ordinary. A hypnotic fusion of undulating waves, sharp edges, and the interplay of smoothness and sharpness.
        </p>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Utensils className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Palate Prestige</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">INTRIGUE THE PALATE</h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          Set out on a journey of taste. All botanicals are enriched with the precious flavor of seafood and gourmet dishes. From rocks to mixology, our gin adapts to every desire.
        </p>
      </div>
    </div>
  );
};

export function ExperienceScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  useEffect(() => {
    if (isActive) {
      window.scrollTo(0, 0);
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="https://v.fastcdn.co/t/17a4ffc6/40f68ef4/1738414899-64867436-417x460x419x462x1x0-section-04-photo.jpg"
      bgImageSrc="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1920"
      title="THE EXPERIENCE"
      subtitle="Saharan Inspired"
      scrollToExpand="SCROLL TO EXPLORE"
    >
      <ExperienceContent />
    </ScrollExpandMedia>
  );
}
