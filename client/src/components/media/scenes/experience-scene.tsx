import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';
import { useTranslation } from 'react-i18next';

interface ScrollableSceneProps {
  isActive: boolean;
  onScrollPositionChange: (position: { isAtTop: boolean; isAtBottom: boolean }) => void;
}

// Local images
const imgExp1 = "/assets/Experience/experience1.jpg";
const imgExp2 = "/assets/Experience/experience2.jpg";
const imgExp3 = "/assets/Experience/cover-experience.png";
const imgExp4 = "/assets/Experience/experience4.jpg";

export function ExperienceScene({ isActive, onScrollPositionChange }: ScrollableSceneProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isActive) {
      onScrollPositionChange({ isAtTop: true, isAtBottom: false });
    }
  }, [isActive, onScrollPositionChange]);

  const timelineData = [
    {
      title: t('experience.section1.title'),
      subtitle: t('experience.section1.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-4">
            {t('experience.section1.text')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src={imgExp1} alt={t('experience.section1.label')} className="object-cover h-64 md:h-72 lg:h-80 w-full rounded-lg" />
            <img src={imgExp2} alt={t('products.limited.botanicals.date', 'Dates')} className="object-cover h-64 md:h-72 lg:h-80 w-full rounded-lg" />
          </div>
        </div>
      ),
    },
    {
      title: t('experience.section2.title'),
      subtitle: t('experience.section2.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-8">
            {t('experience.section2.text')}
          </p>
          <div>
            <img src={imgExp3} alt={t('experience.section2.label')} className="object-cover h-64 md:h-80 lg:h-[28rem] w-full rounded-lg" />
          </div>
        </div>
      ),
    },
    {
      title: t('experience.section3.title'),
      subtitle: t('experience.section3.label'),
      titleClassName: "font-ergon-light tracking-tight",
      subtitleClassName: "font-ergon-light",
      content: (
        <div>
          <div className="w-16 h-[1px] bg-[#F5EFE6]/50 mb-6" />
          <p className="text-base md:text-lg leading-relaxed text-[#F5EFE6]/80 font-ergon-light mb-8">
            {t('experience.section3.text')}
          </p>
          <div className="">
            <img src={imgExp4} alt={t('experience.section3.label')} className="object-contain w-full max-h-[400px] md:max-h-[450px] lg:max-h-[520px] rounded-lg" />
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
          <span className="text-[#F5EFE6] font-ergon-light text-[10px] tracking-[0.3em] uppercase">{t('experience.subtitle')}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-ergon-light text-[#F5EFE6] mt-4 mb-6 tracking-tight">{t('experience.title')}</h2>
          <p className="text-[#F5EFE6]/60 text-sm md:text-base max-w-xl font-ergon-light">
            {t('experience.section1.text')}
          </p>
        </motion.div>
      </div>
      <div className="relative z-10">
        <Timeline data={timelineData} />
      </div>
    </motion.div>
  );
}
