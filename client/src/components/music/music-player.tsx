import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from './music-context';
import { useTranslation } from 'react-i18next';

export function MusicPlayer() {
  const { isMuted, toggleMute, isPlaying } = useMusic();
  const { i18n } = useTranslation('common');
  const [showLanguages, setShowLanguages] = React.useState(false);
  const languages = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'it', name: 'Italiano', short: 'IT' },
    { code: 'de', name: 'Deutsch', short: 'DE' },
    { code: 'ar', name: 'العربية', short: 'AR' },
    { code: 'fr', name: 'Français', short: 'FR' },
    { code: 'es', name: 'Español', short: 'ES' },
  ];
  const currentLangCode = (i18n.language || 'en').split('-')[0].toUpperCase();

  return (
    <div className="fixed top-20 right-20 md:right-24 z-[90] flex items-center gap-2">
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setShowLanguages((prev) => !prev)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-[50px] items-center gap-2 px-3 py-2 bg-[#2B1810]/80 backdrop-blur-sm border border-[#F5EFE6]/30 text-[#F5EFE6]/70 hover:text-[#CD7E31] hover:border-[#CD7E31]/50 transition-all duration-300"
        >
          <Globe className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider hidden sm:inline">{currentLangCode}</span>
        </motion.button>

        {showLanguages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 min-w-[140px] overflow-hidden border border-[#CD7E31]/30 bg-[#2B1810] shadow-xl"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setShowLanguages(false);
                }}
                className={`block w-full px-4 py-2 text-left text-xs font-ergon transition-colors hover:bg-[#CD7E31]/20 ${
                  (i18n.language || 'en').startsWith(lang.code) ? 'text-[#CD7E31]' : 'text-[#F5EFE6]/70'
                }`}
              >
                {lang.short} {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <motion.button
        onClick={toggleMute}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-[50px] items-center gap-2 px-3 py-2 bg-[#2B1810]/80 backdrop-blur-sm border border-[#F5EFE6]/30 text-[#F5EFE6]/70 hover:text-[#CD7E31] hover:border-[#CD7E31]/50 transition-all duration-300"
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Sound Off</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Sound On</span>
            {isPlaying && (
              <span className="flex gap-0.5 items-end h-3 ml-1">
                <motion.span
                  animate={{ height: [3, 8, 3] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-0.5 bg-[#CD7E31]"
                />
                <motion.span
                  animate={{ height: [5, 10, 5] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  className="w-0.5 bg-[#CD7E31]"
                />
                <motion.span
                  animate={{ height: [3, 6, 3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-0.5 bg-[#CD7E31]"
                />
              </span>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
}

export function MusicPlayerCompact() {
  const { isMuted, toggleMute } = useMusic();

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 text-[#F5EFE6]/50 hover:text-[#CD7E31] transition-colors"
      aria-label={isMuted ? 'Unmute music' : 'Mute music'}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </motion.button>
  );
}
