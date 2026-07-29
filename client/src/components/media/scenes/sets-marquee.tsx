import { cn } from '@/lib/utils';

interface MarqueeProps {
  text: string;
  reverse?: boolean;
}

const REPEATS = 4;

export function Marquee({ text, reverse }: MarqueeProps) {
  const unit = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: REPEATS }).map((_, i) => (
        <span key={i} className="flex shrink-0 items-center gap-14 pr-14">
          <span className="font-ergon-light text-xl uppercase tracking-[0.16em] text-[#F5EFE6]/45 sm:text-2xl">
            {text}
          </span>
          <span className="text-sm text-[#D4A373]">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden border-y border-[#F5EFE6]/10 py-5">
      <div
        className={cn(
          'flex w-max whitespace-nowrap',
          reverse ? 'animate-[sets-marquee-reverse_32s_linear_infinite]' : 'animate-[sets-marquee_32s_linear_infinite]',
        )}
      >
        {unit}
        {unit}
      </div>
    </div>
  );
}
