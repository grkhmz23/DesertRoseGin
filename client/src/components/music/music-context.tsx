import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface MusicContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isPlaying: boolean;
  hasInteracted: boolean;
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
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/background-music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      // Ensure seamless looping
      const handleEnded = () => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      // Try to autoplay immediately (will likely fail due to browser policy)
      const tryPlay = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Browser blocked - will try again on interaction
            });
        }
      };
      
      // Try on load
      tryPlay();
      
      // Try again after a short delay (sometimes works)
      const delayTimer = setTimeout(tryPlay, 100);
      const delayTimer2 = setTimeout(tryPlay, 500);
      const delayTimer3 = setTimeout(tryPlay, 1000);
      
      // Capture ANY user interaction to start music
      const startOnInteraction = () => {
        if (!hasInteracted) {
          setHasInteracted(true);
          tryPlay();
        }
      };
      
      // Listen to all possible interaction events
      const events = ['click', 'touchstart', 'mousemove', 'scroll', 'keydown', 'wheel'];
      events.forEach(event => {
        document.addEventListener(event, startOnInteraction, { once: true, passive: true });
      });
      
      return () => {
        clearTimeout(delayTimer);
        clearTimeout(delayTimer2);
        clearTimeout(delayTimer3);
        events.forEach(event => {
          document.removeEventListener(event, startOnInteraction);
        });
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
      isPlaying,
      hasInteracted
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
