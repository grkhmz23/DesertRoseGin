import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from './music-context';
import { useTranslation } from 'react-i18next';

export function MusicPlayer() {
  const { isMuted, toggleMute, isPlaying } = useMusic();
  const { i18n, t } = useTranslation('common');
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
  const controlButtonClass = "relative flex h-8 w-8 items-center justify-center text-[#F5EFE6]/62 hover:text-[#CD7E31] transition-all duration-300 overflow-hidden";
  const languageButtonClass = controlButtonClass;

  return (
    <div className="fixed bottom-4 left-4 md:bottom-20 md:left-8 z-[80] flex items-center gap-2">
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setShowLanguages((prev) => !prev)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={languageButtonClass}
          aria-label={t('ui.music.languageSelectorAria', { code: currentLangCode })}
        >
          <Globe className="w-3.5 h-3.5" strokeWidth={1.2} />
          <span className="absolute bottom-1 right-1 text-[7px] leading-none uppercase tracking-[0.08em] text-[#F5EFE6]/52">
            {currentLangCode}
          </span>
        </motion.button>

        {showLanguages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-0 mb-2 min-w-[140px] overflow-hidden border border-[#CD7E31]/20 bg-[#2B1810] shadow-xl"
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
        className={controlButtonClass}
        aria-label={isMuted ? t('ui.music.unmute') : t('ui.music.mute')}
        title={isMuted ? t('ui.music.soundOff') : t('ui.music.soundOn')}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5" strokeWidth={1.2} />
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5" strokeWidth={1.2} />
            {isPlaying && (
              <span className="absolute bottom-1 right-1 flex gap-0.5 items-end h-2.5">
                <motion.span
                  animate={{ height: [2, 6, 2] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-px bg-[#CD7E31]"
                />
                <motion.span
                  animate={{ height: [3, 7, 3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  className="w-px bg-[#CD7E31]"
                />
                <motion.span
                  animate={{ height: [2, 5, 2] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-px bg-[#CD7E31]"
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
  const { t } = useTranslation('common');

  return (
    <motion.button
      onClick={toggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-1.5 text-[#F5EFE6]/50 hover:text-[#CD7E31] transition-colors"
      aria-label={isMuted ? t('ui.music.unmute') : t('ui.music.mute')}
    >
      {isMuted ? <VolumeX className="w-4 h-4" strokeWidth={1.2} /> : <Volume2 className="w-4 h-4" strokeWidth={1.2} />}
    </motion.button>
  );
}
