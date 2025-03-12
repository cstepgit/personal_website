"use client";

import { useSupabase } from "@/contexts/SupabaseContext";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export function Interests() {
  const { interests, loading, error } = useSupabase();

  if (loading) return null;
  if (error) return null;
  if (!interests || interests.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Interests</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
              type: "spring",
              damping: 20,
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                rotate: [-0.5, 0.5, -0.5, 0],
                transition: {
                  rotate: {
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "linear",
                  },
                },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="h-24 flex items-center justify-center hover:bg-accent transition-colors duration-300 cursor-pointer">
                <p className="text-center font-medium">{interest.interest}</p>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
