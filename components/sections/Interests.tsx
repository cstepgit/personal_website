"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import type { Interest } from "@/types/supabase";
import { X } from "lucide-react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Button } from "@/components/ui/button";

export function Interests() {
  const { interests, loading, error } = useSupabase();
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeInterest = interests?.find((i) => i.id === activeId);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setActiveId(null);
      }
    }

    if (activeId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeId]);

  // Close modal on escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    }

    if (activeId) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeId]);

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!interests || interests.length === 0)
    return <div>No interests found</div>;

  return (
    <section className="space-y-4 sm:space-y-6 w-full">
      <div className="space-y-1 sm:space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl sm:text-2xl font-semibold tracking-tight"
        >
          Interests
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          Click on an interest to view my experience with it
        </motion.p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {interests.map((interest, index) => (
          <motion.div
            key={interest.id}
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              damping: 20,
            }}
            className="w-full"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveId(interest.id)}
            >
              <Card className="h-20 sm:h-24 cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-300 group">
                <div className="h-full flex items-center justify-center relative p-2 sm:p-3">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-center text-sm sm:text-base font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {interest.interest}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeId && activeInterest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
              onClick={() => setActiveId(null)}
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-2xl mx-auto"
            >
              <Card className="relative overflow-hidden shadow-lg">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(null);
                  }}
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-accent hover:text-primary transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
                <CardContent className="p-5 sm:p-7 md:p-9">
                  <div className="space-y-5 sm:space-y-7">
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {activeInterest.interest}
                    </h3>

                    {activeInterest.projects &&
                      activeInterest.projects.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Projects
                          </h4>
                          <ul className="space-y-2 list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400">
                            {activeInterest.projects.map((project) => (
                              <li
                                key={`${activeInterest.id}-project-${project}`}
                                className="pl-2"
                              >
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {activeInterest.active_learning &&
                      activeInterest.active_learning.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Active Learning
                          </h4>
                          <ul className="space-y-2 list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400">
                            {activeInterest.active_learning.map((item) => (
                              <li
                                key={`${activeInterest.id}-learning-${item}`}
                                className="pl-2"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
