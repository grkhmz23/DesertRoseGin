"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
  type OGLRenderingContext,
} from "ogl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  image: string;
  text: string;
  id?: string;
}

interface CircularGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: GalleryItem[];
  bend?: number;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
  fontClassName?: string;
  onItemClick?: (item: GalleryItem, index: number) => void;
}

function debounce(func: (...args: unknown[]) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof (instance as Record<string, unknown>)[key] === "function") {
      (instance as Record<string, unknown>)[key] = (
        (instance as Record<string, unknown>)[key] as (...args: unknown[]) => unknown
      ).bind(instance);
    }
  });
}

type TextureEntry = {
  texture: Texture;
  size: [number, number];
  ready: boolean;
  listeners: Set<(size: [number, number]) => void>;
};

const GLOBAL_TEXTURE_CACHE = new Map<string, TextureEntry>();

function getOrCreateTexture(
  cache: Map<string, TextureEntry> | undefined,
  gl: OGLRenderingContext,
  url: string
): TextureEntry {
  const c = cache ?? GLOBAL_TEXTURE_CACHE;
  const existing = c.get(url);
  if (existing) return existing;

  const texture = new Texture(gl, {
    generateMipmaps: false,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
    wrapS: gl.CLAMP_TO_EDGE,
    wrapT: gl.CLAMP_TO_EDGE,
  });

  const entry: TextureEntry = {
    texture,
    size: [1, 1],
    ready: false,
    listeners: new Set(),
  };

  c.set(url, entry);

  const img = new Image();
  img.decoding = "async";
  // Only set crossOrigin for truly external URLs (not same-origin)
  if (url.startsWith("http") && typeof window !== "undefined" && !url.includes(window.location.hostname)) {
    img.crossOrigin = "anonymous";
  }
  img.src = url;

  img.onload = () => {
    entry.ready = true;
    entry.size = [img.naturalWidth || img.width, img.naturalHeight || img.height];
    entry.texture.image = img;
    for (const fn of entry.listeners) fn(entry.size);
    entry.listeners.clear();
  };

  img.onerror = () => {
    console.warn(`[CircularGallery] Failed to load image: ${url}`);
  };

  return entry;
}

class Media {
  gl: OGLRenderingContext;
  textureCache: Map<string, TextureEntry>;
  geometry: Plane;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: { width: number; height: number };
  text: string;
  viewport: { width: number; height: number };
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program!: Program;
  plane!: Mesh;
  extra: number = 0;
  widthTotal: number = 0;
  width: number = 0;
  x: number = 0;
  scale: number = 1;
  padding: number = 2;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    textureCache,
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: {
    textureCache: Map<string, TextureEntry>;
    geometry: Plane;
    gl: OGLRenderingContext;
    image: string;
    index: number;
    length: number;
    renderer: Renderer;
    scene: Transform;
    screen: { width: number; height: number };
    text: string;
    viewport: { width: number; height: number };
    bend: number;
    textColor: string;
    borderRadius: number;
    font: string;
  }) {
    // FIX: Actually assign textureCache to this instance
    this.textureCache = textureCache;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const entry = getOrCreateTexture(this.textureCache, this.gl, this.image);
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: entry.texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: entry.size },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    if (!entry.ready) {
      entry.listeners.add((size) => {
        if (this.program?.uniforms?.uImageSizes) {
          this.program.uniforms.uImageSizes.value = size;
        }
      });
    }
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll: { current: number; last: number }, direction: "left" | "right") {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);

      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({
    screen,
    viewport,
  }: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    // Responsive scaling for mobile
    const isMobile = this.screen.width < 768;
    this.scale = isMobile ? this.screen.height / 1800 : this.screen.height / 1500;

    this.plane.scale.y = (this.viewport.height * (1080 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (840 * this.scale)) / this.screen.width;
    this.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];

    // Tighter padding on mobile for better card visibility
    this.padding = isMobile ? 1.2 : 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class GalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: OGLRenderingContext;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  mediasImages!: GalleryItem[];
  medias!: Media[];
  isDown: boolean = false;
  start: number = 0;
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf!: number;
  boundOnResize: () => void;
  boundOnWheel: (e: WheelEvent) => void;
  boundOnTouchDown: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp: (e: MouseEvent | TouchEvent) => void;
  onItemClick?: (item: GalleryItem, index: number) => void;
  clickStartX: number = 0;
  clickStartY: number = 0;
  textureCache: Map<string, TextureEntry> = new Map();
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
      onItemClick,
    }: {
      items?: GalleryItem[];
      bend: number;
      textColor: string;
      borderRadius: number;
      font: string;
      scrollSpeed: number;
      scrollEase: number;
      onItemClick?: (item: GalleryItem, index: number) => void;
    }
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onItemClick = onItemClick;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;

    autoBind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      powerPreference: "high-performance",
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 });
  }

  createMedias(items: GalleryItem[] | undefined) {
    const defaultItems: GalleryItem[] = [
      { image: "/ourstory-cover.jpg", text: "Story", id: "story" },
      { image: "/experience_cover.jpg", text: "Experience", id: "experience" },
      { image: "/classic-cover.jpg", text: "Classic", id: "classic" },
    ];

    const galleryItems = items && items.length > 0 ? items : defaultItems;
    // Duplicate items for infinite scroll effect
    this.mediasImages = [...galleryItems, ...galleryItems];

    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        textureCache: this.textureCache,
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend: this.bend,
        textColor: this.textColor,
        borderRadius: this.borderRadius,
        font: this.font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    this.start = clientX;
    this.clickStartX = clientX;
    this.clickStartY = clientY;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = (this.scroll.position || 0) + distance;
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    this.isDown = false;

    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaX = Math.abs(clientX - this.clickStartX);
    const deltaY = Math.abs(clientY - this.clickStartY);

    // If it's a tap (not a drag) - increased threshold for mobile touch
    if (deltaX < 15 && deltaY < 15 && this.onItemClick) {
      const pickedIndex = this.getItemIndexFromPointer(clientX, clientY);
      const mediaIndex = pickedIndex !== -1 ? pickedIndex : this.getCenterItemIndex();
      if (mediaIndex >= 0 && mediaIndex < this.mediasImages.length) {
        const originalIndex = mediaIndex % (this.mediasImages.length / 2);
        this.onItemClick(this.mediasImages[originalIndex], originalIndex);
      }
    }

    this.onCheck();
  }

  getCenterItemIndex(): number {
    if (!this.medias || !this.medias[0]) return -1;
    const width = this.medias[0].width;
    return Math.round(Math.abs(this.scroll.current) / width) % this.mediasImages.length;
  }

  getItemIndexFromPointer(clientX: number, clientY: number): number {
    if (!this.medias || this.medias.length === 0) return -1;

    const worldX = (clientX / this.screen.width - 0.5) * this.viewport.width;
    const worldY = -(clientY / this.screen.height - 0.5) * this.viewport.height;

    let bestIndex = -1;
    let bestScore = Infinity;

    for (let i = 0; i < this.medias.length; i++) {
      const media = this.medias[i];
      const px = media.plane.position.x;
      const py = media.plane.position.y;

      const hitX = media.plane.scale.x * 0.55;
      const hitY = media.plane.scale.y * 0.55;

      const dx = Math.abs(worldX - px);
      const dy = Math.abs(worldY - py);

      if (dx <= hitX && dy <= hitY) {
        const score = dx / hitX + dy / hitY;
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }
    }

    return bestIndex;
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaY || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);

    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("wheel", this.boundOnWheel, { passive: true });
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);

    // Clear texture cache
    this.textureCache.clear();

    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

const CircularGallery = ({
  items,
  bend = 3,
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.05,
  className,
  fontClassName,
  onItemClick,
  ...props
}: CircularGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<GalleryApp | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const computedStyle = getComputedStyle(containerRef.current);
    const computedColor = computedStyle.color || "#F5EFE6";
    const computedFontWeight = computedStyle.fontWeight || "500";
    const computedFontSize = computedStyle.fontSize || "48px";
    const computedFontFamily = computedStyle.fontFamily || "sans-serif";

    const computedFont = `${computedFontWeight} ${computedFontSize} ${computedFontFamily}`;

    appRef.current = new GalleryApp(containerRef.current, {
      items,
      bend,
      textColor: computedColor,
      borderRadius,
      font: computedFont,
      scrollSpeed,
      scrollEase,
      onItemClick,
    });

    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase, fontClassName, onItemClick]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y",
        "text-[#F5EFE6] font-medium text-[48px]",
        fontClassName,
        className
      )}
      {...props}
    />
  );
};

export { CircularGallery };