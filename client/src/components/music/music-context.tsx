import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface MusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('desert-rose-music-muted') === 'true';
    }
    return false;
  });
  
  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('desert-rose-music-volume');
      return saved ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);

  // Initialize audio element and autoplay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/background-music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      // Ensure seamless looping - restart immediately when ended
      const handleEnded = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      // Try to autoplay
      const attemptPlay = () => {
        if (audioRef.current && !hasAttemptedPlay.current) {
          hasAttemptedPlay.current = true;
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Browser blocked autoplay - will retry on first user interaction
              setIsPlaying(false);
            });
        }
      };
      
      // Try immediately
      attemptPlay();
      
      // Also try on first user interaction (in case browser blocked it)
      const handleInteraction = () => {
        if (audioRef.current && !isPlaying) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
      };
      
      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      document.addEventListener('scroll', handleInteraction, { once: true });
      
      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('desert-rose-music-volume', volume.toString());
    }
  }, [volume, isMuted]);

  // Handle mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('desert-rose-music-muted', isMuted.toString());
    }
  }, [isMuted, volume]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  return (
    <MusicContext.Provider value={{ 
      isMuted, 
      toggleMute, 
      volume, 
      setVolume,
      isPlaying 
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
