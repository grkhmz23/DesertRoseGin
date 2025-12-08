import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// Configuration
const MAX_PARTICLES = 1500;
const COLORS = ['#e6c288', '#d4b483', '#c1a66b', '#9e8653'];
const FADE_RATE = 0.006;

// Sand Particle Class
class SandParticle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  color: string;
  height: number;
  width: number;

  constructor(width: number, height: number, initial = false) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.vy = 0;
    this.vx = 0;
    this.color = '';
    this.reset(initial);
  }

  reset(initial = false) {
    // Spawn at bottom, move upward
    this.y = initial ? Math.random() * this.height : this.height + 10;
    this.x = Math.random() * this.width;
    this.size = Math.random() * 2 + 1;
    
    // High vertical speed (upwards)
    const baseSpeed = Math.random() * 10 + 15;
    this.vy = -baseSpeed; // Negative for UP
    
    // Slight horizontal drift
    this.vx = (Math.random() - 0.2) * 2;
    
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  update(intensity: number) {
    // Move up
    this.y += this.vy * (0.5 + intensity);
    // Move sideways with turbulence
    this.x += this.vx * (1 + intensity);
    
    // Wrap around - if off top, reset to bottom
    if (this.y < -10) {
      this.y = this.height + 10;
      this.x = Math.random() * this.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D, stormIntensity: number) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.min(1, stormIntensity * 3);
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Dust Cloud Class
class DustCloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  height: number;
  width: number;

  constructor(width: number, height: number, initial = false) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.size = 0;
    this.speed = 0;
    this.reset(initial);
  }

  reset(initial = false) {
    this.y = initial ? Math.random() * this.height : this.height + 100;
    this.x = Math.random() * this.width;
    this.size = Math.random() * 200 + 100;
    this.speed = Math.random() * 5 + 5;
  }

  update(intensity: number) {
    this.y -= this.speed * (0.5 + intensity);
    if (this.y < -this.size) {
      this.y = this.height + this.size;
      this.x = Math.random() * this.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D, stormIntensity: number) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    const cloudOpacity = Math.min(1, stormIntensity);
    gradient.addColorStop(0, `rgba(194, 160, 101, ${cloudOpacity * 0.5})`);
    gradient.addColorStop(1, 'rgba(194, 160, 101, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export interface SandstormTransitionRef {
  startStorm: (onMidpoint: () => void, onComplete?: () => void) => void;
}

export const SandstormTransition = forwardRef<SandstormTransitionRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const stateRef = useRef({
    particles: [] as SandParticle[],
    clouds: [] as DustCloud[],
    isStorming: false,
    stormIntensity: 0,
    phase: 'idle' as 'idle' | 'build' | 'peak' | 'fade',
    onMidpoint: null as (() => void) | null,
    onComplete: null as (() => void) | null,
    width: 0,
    height: 0,
  });

  // Initialize storm
  const initStorm = (width: number, height: number) => {
    const particles: SandParticle[] = [];
    const clouds: DustCloud[] = [];
    
    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push(new SandParticle(width, height, true));
    }
    for (let i = 0; i < 20; i++) {
      clouds.push(new DustCloud(width, height, true));
    }
    
    stateRef.current.particles = particles;
    stateRef.current.clouds = clouds;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = stateRef.current;
    const { width, height, isStorming, stormIntensity, particles, clouds, phase } = state;
    
    if (!isStorming && stormIntensity <= 0.01) {
      ctx.clearRect(0, 0, width, height);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    ctx.clearRect(0, 0, width, height);
    
    // Gradient haze - diagonal from bottom-left to top-right
    const gradient = ctx.createLinearGradient(0, height, width, 0);
    
    let stopStart = (stormIntensity * 1.5) - 0.5;
    let solidStop = Math.max(0, Math.min(1, stopStart));
    let fadeStop = Math.max(0, Math.min(1, stopStart + 0.4));
    
    gradient.addColorStop(0, 'rgba(100, 80, 50, 1)');
    gradient.addColorStop(solidStop, 'rgba(100, 80, 50, 1)');
    gradient.addColorStop(fadeStop, 'rgba(100, 80, 50, 0)');
    gradient.addColorStop(1, 'rgba(100, 80, 50, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw clouds and particles
    ctx.globalCompositeOperation = 'source-over';
    
    clouds.forEach(c => {
      c.update(stormIntensity);
      c.draw(ctx, stormIntensity);
    });
    
    particles.forEach(p => {
      p.update(stormIntensity);
      p.draw(ctx, stormIntensity);
    });
    
    // Update storm phase
    if (phase === 'build') {
      state.stormIntensity += FADE_RATE;
      if (state.stormIntensity >= 1.2) {
        state.stormIntensity = 1.2;
        state.phase = 'peak';
        
        // Call midpoint callback
        if (state.onMidpoint) {
          state.onMidpoint();
          state.onMidpoint = null;
        }
        
        setTimeout(() => {
          state.phase = 'fade';
        }, 500);
      }
    } else if (phase === 'fade') {
      state.stormIntensity -= FADE_RATE * 1.5;
      if (state.stormIntensity <= 0) {
        state.stormIntensity = 0;
        state.phase = 'idle';
        state.isStorming = false;
        if (canvas) {
          canvas.style.pointerEvents = 'none';
        }
        
        // Call completion callback
        if (state.onComplete) {
          state.onComplete();
          state.onComplete = null;
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      stateRef.current.width = width;
      stateRef.current.height = height;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Expose imperative API
  useImperativeHandle(ref, () => ({
    startStorm: (onMidpoint: () => void, onComplete?: () => void) => {
      console.log('🌪️ [SandstormTransition] startStorm called');
      const state = stateRef.current;
      if (state.isStorming) {
        console.log('🌪️ [SandstormTransition] Already storming, ignoring');
        return;
      }
      
      const canvas = canvasRef.current;
      if (!canvas) {
        console.log('🌪️ [SandstormTransition] No canvas ref, ignoring');
        return;
      }
      
      console.log('🌪️ [SandstormTransition] Starting storm animation');
      state.isStorming = true;
      state.phase = 'build';
      state.stormIntensity = 0;
      state.onMidpoint = onMidpoint;
      state.onComplete = onComplete || null;
      canvas.style.pointerEvents = 'all';
      
      initStorm(state.width, state.height);
      animate();
    }
  }));

  return (
    <canvas
      ref={canvasRef}
      id="sandstormCanvas"
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
});

SandstormTransition.displayName = 'SandstormTransition';
