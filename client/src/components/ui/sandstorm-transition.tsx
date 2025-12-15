import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

// Configuration – using your updated engine values
const MAX_PARTICLES = 7500;
const SAND_COLORS = ["#e6c288", "#d4b483", "#c1a66b", "#9e8653"];
const FADE_RATE = 0.025; // ~1.7s build + ~1.7s fade

class SandParticle {
  x!: number;
  y!: number;
  size!: number;
  vx!: number;
  vy!: number;
  waveOffset!: number;
  waveSpeed!: number;
  color!: string;

  constructor(width: number, height: number, initial: boolean) {
    this.reset(width, height, initial);
  }

  reset(width: number, height: number, initial: boolean) {
    const rand = Math.random();

    // 30% - RIGHT SIDE BOTTOM TO TOP (Updraft)
    if (rand < 0.3) {
      const minX = width * 0.4;
      const range = width * 0.6;
      this.x = minX + Math.random() * range;
      this.y = initial ? Math.random() * height : height + 10;

      const speed = Math.random() * 15 + 20;
      this.vy = -speed;
      this.vx = (Math.random() - 0.5) * 2;
    }

    // 25% - BOTTOM SIDE LEFT TO RIGHT
    else if (rand < 0.55) {
      this.x = initial ? Math.random() * (width * 0.3) : -10;
      this.y =
        (initial ? Math.random() * 0.3 + 0.7 : Math.random() * 0.2 + 0.8) *
        height;

      const speed = Math.random() * 15 + 20;
      this.vx = speed;
      this.vy = (Math.random() - 0.5) * 5;
    }

    // 45% - MAINLY LEFT BOTTOM CORNER
    else {
      if (Math.random() > 0.5) {
        this.x = Math.random() * (width * 0.8);
        this.y = height + 10;
      } else {
        this.x = -10;
        this.y = Math.random() * height;
      }

      const speed = Math.random() * 10 + 15;
      this.vx = speed;
      this.vy = -speed;
    }

    this.size = Math.random() * 1.5 + 0.5;
    this.waveOffset = Math.random() * 100;
    this.waveSpeed = Math.random() * 0.05 + 0.02;
    this.color =
      SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)];
  }

  update(intensity: number, width: number, height: number) {
    this.y += this.vy * (0.6 + intensity);
    this.x += this.vx * (0.6 + intensity);

    // Wavy motion depending on dominant direction
    if (Math.abs(this.vy) > Math.abs(this.vx)) {
      this.x += Math.sin(this.y * this.waveSpeed + this.waveOffset) * 2;
    } else {
      this.y += Math.sin(this.x * this.waveSpeed + this.waveOffset) * 2;
    }

    if (
      this.y < -50 ||
      this.x > width + 50 ||
      this.y > height + 50 ||
      this.x < -50
    ) {
      this.reset(width, height, false);
    }
  }

  draw(ctx: CanvasRenderingContext2D, stormIntensity: number) {
    const prevAlpha = ctx.globalAlpha;

    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.min(1, stormIntensity * 3);
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.globalAlpha = prevAlpha;
  }
}

type Phase = "idle" | "build" | "peak" | "fade";

interface SandstormState {
  particles: SandParticle[];
  isStorming: boolean;
  stormIntensity: number;
  phase: Phase;
  onMidpoint: (() => void) | null;
  onComplete: (() => void) | null;
  width: number;
  height: number;
}

export interface SandstormTransitionRef {
  startStorm: (onMidpoint: () => void, onComplete?: () => void) => void;
}

export const SandstormTransition = forwardRef<SandstormTransitionRef>(
  (_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const stateRef = useRef<SandstormState>({
      particles: [],
      isStorming: false,
      stormIntensity: 0,
      phase: "idle",
      onMidpoint: null,
      onComplete: null,
      width: 0,
      height: 0,
    });

    const initStorm = (width: number, height: number) => {
      const particles: SandParticle[] = [];
      for (let i = 0; i < MAX_PARTICLES; i++) {
        particles.push(new SandParticle(width, height, true));
      }
      stateRef.current.particles = particles;
    };

    const updatePhase = () => {
      const state = stateRef.current;

      if (state.phase === "build") {
        state.stormIntensity += FADE_RATE;
        if (state.stormIntensity >= 1.2) {
          state.stormIntensity = 1.2;
          state.phase = "peak";

          if (state.onMidpoint) {
            state.onMidpoint();
            state.onMidpoint = null;
          }

          setTimeout(() => {
            // Only move to fade if we are still in peak
            if (stateRef.current.phase === "peak") {
              stateRef.current.phase = "fade";
            }
          }, 100);
        }
      } else if (state.phase === "fade") {
        state.stormIntensity -= FADE_RATE;
        if (state.stormIntensity <= 0) {
          state.stormIntensity = 0;
          state.phase = "idle";
          state.isStorming = false;

          const canvas = canvasRef.current;
          if (canvas) {
            canvas.style.pointerEvents = "none";
          }

          const cb = state.onComplete;
          state.onComplete = null;
          if (cb) cb();
        }
      }
    };

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const state = stateRef.current;
      const {
        width,
        height,
        isStorming,
        stormIntensity,
        particles,
      } = state;

      if (!isStorming && stormIntensity <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        if (animationRef.current != null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Background dust haze
      const gradient = ctx.createLinearGradient(0, height, width, 0);
      const stopStart = stormIntensity * 1.5 - 0.5;
      const solidStop = Math.max(0, Math.min(1, stopStart));
      const fadeStop = Math.max(0, Math.min(1, stopStart + 0.4));

      gradient.addColorStop(0, "rgba(100, 80, 50, 1)");
      gradient.addColorStop(solidStop, "rgba(100, 80, 50, 1)");
      gradient.addColorStop(fadeStop, "rgba(100, 80, 50, 0)");
      gradient.addColorStop(1, "rgba(100, 80, 50, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Sun glare trying to pierce the storm
      if (stormIntensity > 0.2) {
        ctx.save();

        const sunX = width * 0.7;
        const sunY = height * 0.3;
        const sunSize = height * 0.6;
        const sunGrad = ctx.createRadialGradient(
          sunX,
          sunY,
          10,
          sunX,
          sunY,
          sunSize
        );

        sunGrad.addColorStop(
          0,
          `rgba(255, 240, 200, ${stormIntensity * 0.8})`
        );
        sunGrad.addColorStop(
          0.4,
          `rgba(200, 150, 50, ${stormIntensity * 0.6})`
        );
        sunGrad.addColorStop(1, "rgba(100, 80, 50, 0)");

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();
      }

      // 3. Sand particles
      for (const p of particles) {
        p.update(stormIntensity, width, height);
        p.draw(ctx, stormIntensity);
      }

      updatePhase();
      animationRef.current = requestAnimationFrame(animate);
    };

    useImperativeHandle(ref, () => ({
      startStorm(onMidpoint: () => void, onComplete?: () => void) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const state = stateRef.current;
        if (state.isStorming) return; // Prevent re-entry

        state.isStorming = true;
        state.phase = "build";
        state.stormIntensity = 0;
        state.onMidpoint = onMidpoint;
        state.onComplete = onComplete ?? null;

        canvas.style.pointerEvents = "all";

        const width = state.width || window.innerWidth;
        const height = state.height || window.innerHeight;
        initStorm(width, height);

        if (animationRef.current == null) {
          animationRef.current = requestAnimationFrame(animate);
        }
      },
    }));

    useEffect(() => {
      const handleResize = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        stateRef.current.width = width;
        stateRef.current.height = height;
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current != null) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        id="sandstormCanvas"
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ width: "100vw", height: "100vh" }}
      />
    );
  }
);

SandstormTransition.displayName = "SandstormTransition";
