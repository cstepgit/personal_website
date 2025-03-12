"use client";

import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);
  const textY = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <motion.div
      ref={containerRef}
      className="h-screen flex items-center justify-center fixed inset-0 pointer-events-none"
      style={{ opacity }}
    >
      <motion.div className="text-center" style={{ scale, y: textY }}>
        <h1 className="text-7xl font-bold tracking-tighter mb-6">
          Cooper Stepanian
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl text-zinc-600 dark:text-zinc-400 font-light"
        >
          Learn about my skillsets and experiences
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
