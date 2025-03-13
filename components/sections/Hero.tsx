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
      <motion.div
        className="text-center px-4 sm:px-6 max-w-full"
        style={{ scale, y: textY }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 sm:mb-6">
          Cooper Stepanian
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-lg sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light"
        >
          Learn about my interests, skillsets, and experiences
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
