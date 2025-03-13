"use client";

import { useSupabase } from "@/contexts/SupabaseContext";
import { Badge } from "@/components/ui/badge";
import type { WorkExperience, Tag } from "@/types/supabase";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Calendar, MapPin } from "lucide-react";
import { useRef } from "react";

function TimelineItem({
  experience,
  index,
}: {
  experience: WorkExperience;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  const {
    job_title,
    description,
    start_date,
    end_date,
    tags,
    job_type,
    url,
    company,
    location,
    id,
  } = experience;

  // Function to scroll to the corresponding experience section
  const scrollToExperience = () => {
    const experienceElement = document.getElementById(`experience-${id}`);
    if (experienceElement) {
      experienceElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Simple date formatting
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const startDateFormatted = formatDate(start_date);
  const endDateFormatted = end_date ? formatDate(end_date) : "Present";

  // Organize tags by type
  const tagsByType =
    tags?.reduce<Record<string, Tag[]>>((acc, tag) => {
      const type = tag.type || "Other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(tag);
      return acc;
    }, {}) || {};

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-4 z-0">
        {index !== 0 && <div className="h-8 w-px bg-border absolute -top-8" />}
      </div>

      {/* Timeline dot with animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1 + index * 0.05,
        }}
        className="absolute left-0 top-0 w-9 h-9 rounded-full border-2 border-border bg-background z-10 flex items-center justify-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="w-3 h-3 rounded-full bg-primary"
        />
      </motion.div>

      {/* Content card with staggered animations */}
      <div className="ml-16 mb-12 relative">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2 + index * 0.05,
          }}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-lg flex items-center gap-1">
              <button
                type="button"
                onClick={scrollToExperience}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                {job_title}
              </button>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                  aria-label={`Visit ${company} website`}
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </h3>
            {job_type && (
              <Badge variant="secondary" className="font-normal">
                {job_type.type}
              </Badge>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="inline-block">{company}</span>
              {location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </>
              )}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            <span>
              {startDateFormatted} - {endDateFormatted}
            </span>
          </motion.p>
        </motion.div>

        {/* Expandable content */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 overflow-hidden border-l-2 border-border pl-3"
        >
          <p className="text-sm text-foreground/80 whitespace-pre-line mb-3">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="space-y-2">
              {Object.entries(tagsByType).map(([type, typeTags]) => (
                <div key={type} className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground">
                    {type}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {typeTags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const { experiences, loading, error } = useSupabase();
  const containerRef = useRef<HTMLDivElement>(null);

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) return null;
  if (!experiences || experiences.length === 0) return null;

  // Sort experiences by start date (newest first)
  const sortedExperiences = [...experiences].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <section className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold tracking-tight"
      >
        Experience Timeline
      </motion.h2>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative pl-4 pt-8"
      >
        {sortedExperiences.map((exp, index) => (
          <TimelineItem key={exp.id} experience={exp} index={index} />
        ))}
      </motion.div>
    </section>
  );
}
