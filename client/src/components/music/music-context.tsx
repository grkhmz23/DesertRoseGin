import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('desert-rose-music-playing') === 'true';
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
  
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('desert-rose-music-muted') === 'true';
    }
    return false;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/background-music.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : volume;
      
      // Auto-play if previously playing (browsers may block this)
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Browser blocked autoplay, user needs to click play
          setIsPlaying(false);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
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

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('desert-rose-music-playing', isPlaying.toString());
    }
  }, [isPlaying]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('desert-rose-music-muted', isMuted.toString());
    }
  }, [isMuted, volume]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <MusicContext.Provider value={{ 
      isPlaying, 
      togglePlay, 
      volume, 
      setVolume, 
      isMuted, 
      toggleMute 
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
