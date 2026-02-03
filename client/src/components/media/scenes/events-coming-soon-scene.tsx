import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, Sparkles } from 'lucide-react';

interface EventsComingSoonSceneProps {
  isActive: boolean;
}

export function EventsComingSoonScene({ isActive }: EventsComingSoonSceneProps) {
  const { t } = useTranslation('common');

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#2B1810]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1920"
          alt="Events Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B1810]/80 via-[#2B1810]/90 to-[#2B1810]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#CD7E31]/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#CD7E31]" />
            <span className="text-xs font-ergon tracking-[0.2em] uppercase text-[#CD7E31]">
              {t('events.subtitle')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-lux text-[#F5EFE6] mb-6">
            {t('events.title')}
          </h1>

          <p className="text-lg md:text-xl text-[#F5EFE6]/70 max-w-2xl mx-auto leading-relaxed font-ergon">
            {t('events.description')}
          </p>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          <div className="flex flex-col items-center gap-3">
            <Calendar className="w-8 h-8 text-[#CD7E31]" />
            <span className="text-sm text-[#F5EFE6]/60 font-ergon">Exclusive Events</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Users className="w-8 h-8 text-[#CD7E31]" />
            <span className="text-sm text-[#F5EFE6]/60 font-ergon">Partnerships</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#CD7E31]" />
            <span className="text-sm text-[#F5EFE6]/60 font-ergon">Experiences</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
