import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({ images, index, alt, onClose, onIndexChange }: LightboxProps) {
  const hasMultiple = images.length > 1;
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
  }, [index]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (hasMultiple && event.key === "ArrowLeft") {
        onIndexChange((index - 1 + images.length) % images.length);
      }
      if (hasMultiple && event.key === "ArrowRight") {
        onIndexChange((index + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultiple, images.length, index, onClose, onIndexChange]);

  const content = (
    <AnimatePresence>
      <motion.div
        key="apparel-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#2B1810]/95 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        {/*
          When zoomed, the controls move to the true screen edges instead of
          hugging the (now visually overflowed) image card. They live here,
          outside the card's motion.div, because that div animates
          y/scale — a non-none transform establishes a new containing block,
          so position:fixed inside it would resolve relative to the card
          instead of the viewport.
        */}
        {isZoomed ? (
          <>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              className="fixed right-4 top-4 z-10 bg-[#2B1810]/80 p-2 text-[#F5EFE6]/70 transition-colors hover:text-[#CD7E31]"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.2} />
            </button>
            {hasMultiple ? (
              <>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onIndexChange((index - 1 + images.length) % images.length);
                  }}
                  className="fixed left-4 top-1/2 z-10 -translate-y-1/2 bg-[#2B1810]/70 p-2 text-[#F5EFE6]/80 transition-colors hover:text-[#CD7E31]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onIndexChange((index + 1) % images.length);
                  }}
                  className="fixed right-4 top-1/2 z-10 -translate-y-1/2 bg-[#2B1810]/70 p-2 text-[#F5EFE6]/80 transition-colors hover:text-[#CD7E31]"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </>
            ) : null}
          </>
        ) : null}

        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.96 }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex max-h-[85vh] w-full max-w-2xl items-center justify-center"
        >
          {!isZoomed ? (
            <button
              onClick={onClose}
              className="absolute -top-4 right-0 z-10 bg-[#2B1810]/80 p-2 text-[#F5EFE6]/70 transition-colors hover:text-[#CD7E31] md:-top-2 md:-right-12"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.2} />
            </button>
          ) : null}

          <img
            src={images[index]}
            alt={alt}
            onDoubleClick={() => setIsZoomed((zoomed) => !zoomed)}
            className={`max-h-[80vh] w-auto max-w-full select-none object-contain shadow-2xl transition-transform duration-300 ${
              isZoomed ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in"
            }`}
            draggable={false}
          />

          {hasMultiple && !isZoomed ? (
            <>
              <button
                onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#2B1810]/70 p-2 text-[#F5EFE6]/80 transition-colors hover:text-[#CD7E31]"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <button
                onClick={() => onIndexChange((index + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2B1810]/70 p-2 text-[#F5EFE6]/80 transition-colors hover:text-[#CD7E31]"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
