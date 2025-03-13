"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import type { Interest } from "@/types/supabase";
import { X } from "lucide-react";
import { useSupabase } from "@/contexts/SupabaseContext";

export function Interests() {
  const { interests, loading, error } = useSupabase();
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeInterest = interests.find((i) => i.id === activeId);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
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

  // Handle escape key to close modal
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveId(null);
      }
    }

    if (activeId) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [activeId]);

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
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
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              damping: 20,
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveId(interest.id)}
            >
              <Card className="h-24 cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-300 group">
                <div className="h-full flex items-center justify-center relative">
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-center font-medium group-hover:text-primary transition-colors">
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
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setActiveId(null)}
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-lg mx-auto"
            >
              <Card className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveId(null);
                  }}
                  className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-accent transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      {activeInterest.interest}
                    </h3>
                    {activeInterest.projects &&
                      activeInterest.projects.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-muted-foreground">
                            Projects
                          </h4>
                          <ul className="space-y-1 list-disc list-inside">
                            {activeInterest.projects.map((project) => (
                              <li
                                key={`${activeInterest.id}-project-${project}`}
                              >
                                {project}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    {activeInterest.active_learning &&
                      activeInterest.active_learning.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-muted-foreground">
                            Active Learning
                          </h4>
                          <ul className="space-y-1 list-disc list-inside">
                            {activeInterest.active_learning.map((path) => (
                              <li key={`${activeInterest.id}-path-${path}`}>
                                {path}
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
