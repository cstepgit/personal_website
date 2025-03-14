"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";

export function Introduction() {
  return (
    <section className="space-y-6 sm:space-y-8 w-full">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold tracking-tight"
      >
        README.md
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4 text-sm sm:text-base flex-1"
        >
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            I'm a recent Computer Science graduate figuring out where I want to
            take my career. I enjoy many different domains of computer science
            and the blend of engineering and business. I'm currently looking for
            a job in the industry so if you find my experience interesting,
            please reach out!
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            My journey spans various domains including web dev, data
            engineering, deep learning, mobile app dev, owning my own startup,
            and cyber security.
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Below you can interact with a chatbot that I built to help you learn
            more about me and scroll through my experiences as a student and
            professional.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
