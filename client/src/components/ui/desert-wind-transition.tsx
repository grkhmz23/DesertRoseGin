import { AnimatePresence, motion } from "framer-motion";

interface DesertWindTransitionProps {
  active: boolean;
}

export function DesertWindTransition({ active }: DesertWindTransitionProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      )}
    </AnimatePresence>
  );
}
