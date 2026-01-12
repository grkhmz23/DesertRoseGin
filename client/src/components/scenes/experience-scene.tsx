import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Scale, Utensils, Sparkles } from 'lucide-react';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

const ExperienceContent = () => {
  return (
    <div className='max-w-5xl mx-auto space-y-16'>
      {/* Section 1: Balance & Asymmetry */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Scale className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Balance & Asymmetry</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">
          INDULGE IN AN OPULENT ESCAPE
        </h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon mb-4'>
          Like the enchanting mineral in the Saharan desert, which grows amidst the harshest conditions, our impeccably crafted gin beckons you to go beyond the ordinary.
        </p>
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          The graceful equilibrium of balance and asymmetry, the interplay of smoothness and sharpness, and the hypnotic fusion of undulating waves and sharp edges.
        </p>
      </div>

      {/* Section 2: Palate Prestige */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Utensils className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Palate Prestige</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">
          INTRIGUE THE PALATE
        </h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          Set out on a journey of taste that invites you to indulge in a world of unparalleled flavors and inspiration. All the botanicals are enriched with the precious flavor of seafood and gourmet dishes.
        </p>
      </div>

      {/* Section 3: Redefine Versatility */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-[#CD7E31]">
          <Sparkles className="w-5 h-5" />
          <span className="font-ergon text-[10px] tracking-[0.25em] uppercase">Versatility</span>
        </div>
        <h3 className="font-lux text-3xl md:text-4xl mb-4 text-[#F5EFE6]">
          REDEFINE VERSATILITY
        </h3>
        <div className="w-16 h-[1px] bg-[#CD7E31]/50 mb-6" />
        <p className='text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon'>
          From rocks to mixology, you can explore various dimensions. Our gin adapts to every desire.
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
      bgImageSrc="/experience_cover.png"
      title="THE EXPERIENCE"
      subtitle="Saharan Inspired"
      scrollToExpand="SCROLL TO EXPLORE"
    >
      <ExperienceContent />
    </ScrollExpandMedia>
  );
}