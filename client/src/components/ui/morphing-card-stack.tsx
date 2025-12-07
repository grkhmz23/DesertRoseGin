import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Card {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  color: string;
}

interface MorphingCardStackProps {
  cards: Card[];
  defaultLayout?: "stack" | "grid" | "list";
}

export function MorphingCardStack({
  cards,
  defaultLayout = "stack",
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<"stack" | "grid" | "list">(defaultLayout);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerVariants = {
    stack: {
      gap: 0,
      gridCols: "1",
    },
    grid: {
      gap: 32,
      gridCols: "repeat(auto-fit, minmax(250px, 1fr))",
    },
    list: {
      gap: 16,
      gridCols: "1",
    },
  };

  const cardVariants = {
    stack: {
      initial: (i: number) => ({
        opacity: i === selectedIndex ? 1 : 0,
        scale: i === selectedIndex ? 1 : 0.9,
        y: i === selectedIndex ? 0 : 20,
        zIndex: cards.length - i,
      }),
      animate: (i: number) => ({
        opacity: i === selectedIndex ? 1 : 0,
        scale: i === selectedIndex ? 1 : 0.9,
        y: i === selectedIndex ? 0 : 20,
        zIndex: cards.length - i,
      }),
    },
    grid: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    list: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Layout Toggle */}
      <div className="flex justify-center gap-4 mb-12">
        {["stack", "grid", "list"].map((l) => (
          <button
            key={l}
            onClick={() => {
              setLayout(l as "stack" | "grid" | "list");
              setSelectedIndex(0);
            }}
            className={`px-6 py-2 font-hud text-sm uppercase tracking-widest transition-all ${
              layout === l
                ? "bg-[#CD7E31] text-white shadow-lg"
                : "border border-[#917D37] text-[#917D37] hover:bg-[#917D37]/10"
            }`}
            data-testid={`button-layout-${l}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Cards Container */}
      <div
        className={`relative w-full ${
          layout === "stack"
            ? "h-96"
            : layout === "grid"
            ? "grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
            : "flex flex-col gap-4"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {layout === "stack" ? (
            // Stack Layout
            cards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                variants={cardVariants.stack}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 0.4,
                  delay: i === selectedIndex ? 0 : 0.1,
                }}
                className="absolute w-full h-full cursor-pointer"
                onClick={() => setSelectedIndex(i)}
              >
                <div
                  className="w-full h-full rounded-lg p-8 flex flex-col justify-between overflow-hidden group"
                  style={{ backgroundColor: card.color }}
                  data-testid={`card-morphing-${card.id}`}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-black to-white" />
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">{card.icon}</div>
                    <h3 className="text-2xl font-lux text-[#050606] mb-2">
                      {card.title}
                    </h3>
                  </div>
                  <p className="relative z-10 text-sm text-gray-700 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : layout === "grid" ? (
            // Grid Layout
            cards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                variants={cardVariants.grid}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-lg p-8 flex flex-col justify-between overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow h-80"
                style={{ backgroundColor: card.color }}
                onClick={() => setSelectedIndex(i)}
                data-testid={`card-morphing-${card.id}`}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-black to-white" />
                <div className="relative z-10">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="text-xl font-lux text-[#050606] mb-2">
                    {card.title}
                  </h3>
                </div>
                <p className="relative z-10 text-sm text-gray-700 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            ))
          ) : (
            // List Layout
            cards.map((card, i) => (
              <motion.div
                key={card.id}
                custom={i}
                variants={cardVariants.list}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-lg p-6 flex items-center gap-6 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                style={{ backgroundColor: card.color }}
                onClick={() => setSelectedIndex(i)}
                data-testid={`card-morphing-${card.id}`}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br from-black to-white" />
                <div className="relative z-10 text-3xl">{card.icon}</div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-lg font-lux text-[#050606]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Stack Navigation Dots */}
      {layout === "stack" && (
        <div className="flex justify-center gap-3 mt-12">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === selectedIndex ? "w-8 bg-[#CD7E31]" : "w-2 bg-gray-300"
              }`}
              data-testid={`dot-${i}`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
