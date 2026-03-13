import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';
import { useTranslation } from 'react-i18next';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

// Local optimized images
const imgCover = "/assets/our_story/cover-card.jpg";
const imgStory1 = "/assets/our_story/story-1.jpg";
const imgStory2 = "/assets/our_story/story-2.jpg";
const imgStory3 = "/assets/our_story/story-3.jpg";
const imgStory5 = "/assets/our_story/story-5.jpg";
const imgStory6 = "/assets/our_story/story-6.jpg";

export function StoryScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const timelineData = [
    {
      title: t('story.section1.title'),
      subtitle: t('story.section1.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-8">
            {t('story.section1.text')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgStory1} alt={t('story.section1.label')} className="object-cover h-48 md:h-64 w-full" />
            <img src={imgStory2} alt={t('story.title')} className="object-cover h-48 md:h-64 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: t('story.section2.title'),
      subtitle: t('story.section2.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-8">
            {t('story.section2.text')}
          </p>
          <div>
            <img src={imgStory3} alt={t('story.section2.label')} className="object-cover h-64 md:h-96 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: t('story.section3.title'),
      subtitle: t('story.section3.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-8">
            {t('story.section3.text')}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img src={imgStory5} alt={t('story.section3.title')} className="object-cover h-48 md:h-64 w-full" />
            <img src={imgStory6} alt={t('story.section3.label')} className="object-cover h-48 md:h-64 w-full" />
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
          <span className="text-[#F5EFE6] font-ergon-light text-[10px] tracking-[0.3em] uppercase">{t('story.section1.label')}</span>
          <h2 className="text-4xl md:text-6xl font-ergon-light text-[#F5EFE6] mt-4 mb-6 tracking-tight">{t('story.title')}</h2>
          <p className="text-[#F5EFE6]/60 text-sm md:text-base max-w-xl font-ergon-light">
            {t('story.section1.text')}
          </p>
        </motion.div>
      </div>
      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </motion.div>
  );
}
