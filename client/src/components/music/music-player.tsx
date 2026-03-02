import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { useMusic } from './music-context';

export function MusicPlayer() {
  const { isPlaying, togglePlay, volume, setVolume, isMuted, toggleMute } = useMusic();
  const [showVolume, setShowVolume] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[80] flex items-center gap-2">
      <AnimatePresence>
        {showVolume && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-[#2B1810]/90 backdrop-blur-sm border border-[#CD7E31]/30 px-3 py-2"
          >
            <button
              onClick={toggleMute}
              className="text-[#F5EFE6]/70 hover:text-[#CD7E31] transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-[#F5EFE6]/20 accent-[#CD7E31] cursor-pointer"
              aria-label="Volume control"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-3 py-2 border transition-all duration-300 ${
          isPlaying
            ? 'bg-[#CD7E31]/20 border-[#CD7E31]/50 text-[#CD7E31]'
            : 'bg-[#2B1810]/90 border-[#F5EFE6]/20 text-[#F5EFE6]/70 hover:border-[#CD7E31]/50 hover:text-[#CD7E31]'
        }`}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Pause</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Play</span>
          </>
        )}
      </motion.button>

      {/* Visual indicator when music is playing */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-[#CD7E31] rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-full h-full bg-[#CD7E31] rounded-full"
          />
        </motion.div>
      )}
    </div>
  );
}

// Compact version for header
export function MusicPlayerCompact() {
  const { isPlaying, togglePlay } = useMusic();

  return (
    <motion.button
      onClick={togglePlay}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-2 transition-all duration-300 ${
        isPlaying
          ? 'text-[#CD7E31]'
          : 'text-[#F5EFE6]/50 hover:text-[#F5EFE6]'
      }`}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {isPlaying ? (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Music className="w-5 h-5" />
        </motion.div>
      ) : (
        <Music className="w-5 h-5" />
      )}
      
      {/* Playing indicator dot */}
      {isPlaying && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#CD7E31] rounded-full"
        />
      )}
    </motion.button>
  );
}
