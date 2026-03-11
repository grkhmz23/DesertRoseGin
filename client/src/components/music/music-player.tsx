import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useMusic } from './music-context';

export function MusicPlayer() {
  const { isMuted, toggleMute, isPlaying } = useMusic();

  return (
    <motion.button
      onClick={toggleMute}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 left-4 md:bottom-20 md:left-8 z-[80] flex items-center gap-2 px-3 py-2 bg-[#2B1810]/80 backdrop-blur-sm border border-[#F5EFE6]/20 text-[#F5EFE6]/70 hover:text-[#CD7E31] hover:border-[#CD7E31]/50 transition-all duration-300"
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
          {/* Sound wave animation when playing */}
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
