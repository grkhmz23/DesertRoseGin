import { ParallaxBottle } from "./parallax-bottle";

interface ProductBottleSectionProps {
  bottleImage: string;
  name: string;
  isDark: boolean;
}

export function ProductBottleSection({ bottleImage, name, isDark }: ProductBottleSectionProps) {
  return (
    <div className="w-full md:w-1/3 order-1 md:order-2 h-[50vh] md:h-[70vh] flex items-center justify-center relative">
      <ParallaxBottle
        src={bottleImage}
        alt={name}
        className="h-full w-full"
        maxTilt={12}
        scale={1.03}
        glowColor={isDark ? "rgba(205, 126, 49, 0.5)" : "rgba(145, 125, 55, 0.4)"}
      />
    </div>
  );
}
