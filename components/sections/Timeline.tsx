"use client";

import React, { useRef, useState, useEffect } from "react";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Badge } from "@/components/ui/badge";
import type {
  WorkExperience,
  Tag,
  EducationExperience,
} from "@/types/supabase";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, MapPin, GraduationCap } from "lucide-react";

type TimelineEntry = {
  id: number;
  type: "work" | "education";
  date: string; // start_date for sorting
  component: React.ReactElement<{ index: number }>;
};

function TimelineItem({
  experience,
  index,
}: {
  experience: WorkExperience;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [formattedDates, setFormattedDates] = useState({
    start: "",
    end: "Present",
  });

  useEffect(() => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    };

    setFormattedDates({
      start: formatDate(experience.start_date),
      end: experience.end_date ? formatDate(experience.end_date) : "Present",
    });
  }, [experience.start_date, experience.end_date]);

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
      className="group relative w-full"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-3 sm:ml-4 z-0">
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
        className="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-border bg-background z-10 flex items-center justify-center"
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
          className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary"
        />
      </motion.div>

      {/* Content card with staggered animations */}
      <div className="ml-10 sm:ml-12 md:ml-16 mb-12 relative">
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
          className="flex flex-col space-y-1 w-full"
        >
          <div className="flex items-center gap-1.5 flex-wrap w-full pr-2">
            <h3 className="font-medium text-sm sm:text-base md:text-lg flex items-center gap-1 break-words">
              <button
                type="button"
                onClick={scrollToExperience}
                className="hover:text-primary transition-colors cursor-pointer text-left"
              >
                {job_title}
              </button>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex-shrink-0"
                  aria-label={`Visit ${company} website`}
                >
                  <ExternalLink className="size-3 sm:size-3.5" />
                </a>
              )}
            </h3>
            {job_type && (
              <Badge variant="secondary" className="font-normal text-xs">
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
            <p className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
              <span className="inline-block">{company}</span>
              {location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
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
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            <span>
              {formattedDates.start} - {formattedDates.end}
            </span>
          </motion.p>
        </motion.div>

        {/* Expandable content */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 overflow-hidden border-l-2 border-border pl-2 sm:pl-3"
        >
          <p className="text-xs text-foreground/80 whitespace-pre-line mb-2 sm:mb-3 pr-2">
            {description}
          </p>

          {tags && tags.length > 0 && (
            <div className="space-y-1.5 sm:space-y-2">
              {Object.entries(tagsByType).map(([type, typeTags]) => (
                <div key={type} className="space-y-1">
                  <h4 className="text-xs font-medium text-muted-foreground">
                    {type}
                  </h4>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {typeTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs px-1.5 py-0"
                      >
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

function TimelineEducationItem({
  education,
  index,
}: {
  education: EducationExperience;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [formattedDates, setFormattedDates] = useState({
    start: "",
    end: "Present",
  });

  useEffect(() => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    };

    setFormattedDates({
      start: formatDate(education.start_date),
      end: education.end_date ? formatDate(education.end_date) : "Present",
    });
  }, [education.start_date, education.end_date]);

  const { id, university, degree, degree_type, gpa } = education;

  // Function to scroll to the corresponding education section
  const scrollToEducation = () => {
    const educationElement = document.getElementById(`education-${id}`);
    if (educationElement) {
      educationElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px 0px -100px 0px" }}
      transition={{ duration: 0.5 }}
      className="group relative w-full"
    >
      {/* Timeline connector */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border ml-3 sm:ml-4 z-0">
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
        className="absolute left-0 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-border bg-background z-10 flex items-center justify-center"
      >
        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      </motion.div>

      {/* Content card with staggered animations */}
      <div className="ml-10 sm:ml-12 md:ml-16 mb-12 relative">
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
          className="flex flex-col space-y-1 w-full"
        >
          <div className="flex items-center gap-1.5 flex-wrap w-full pr-2">
            <h3 className="font-medium text-sm sm:text-base md:text-lg flex items-center gap-1 break-words">
              <button
                type="button"
                onClick={scrollToEducation}
                className="hover:text-primary transition-colors cursor-pointer text-left"
              >
                {degree_type} in {degree}
              </button>
            </h3>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <p className="text-xs text-muted-foreground">{university}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="flex flex-wrap items-center gap-2"
          >
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
              <span>
                {formattedDates.start} - {formattedDates.end}
              </span>
            </p>
            <span className="text-xs text-muted-foreground">•</span>
            <p className="text-xs text-muted-foreground">
              GPA: {gpa.toFixed(2)}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  const { experiences, education, loading, error } = useSupabase();
  const containerRef = useRef<HTMLDivElement>(null);

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) return null;
  if (
    (!experiences || experiences.length === 0) &&
    (!education || education.length === 0)
  )
    return null;

  // Combine and sort experiences and education by date
  const timelineEntries: TimelineEntry[] = [
    ...(experiences?.map((exp) => ({
      id: exp.id,
      type: "work" as const,
      date: exp.start_date,
      component: (
        <TimelineItem key={`work-${exp.id}`} experience={exp} index={0} />
      ),
    })) || []),
    ...(education?.map((edu) => ({
      id: edu.id,
      type: "education" as const,
      date: edu.start_date,
      component: (
        <TimelineEducationItem
          key={`education-${edu.id}`}
          education={edu}
          index={0}
        />
      ),
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="space-y-6 w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl sm:text-2xl font-semibold tracking-tight"
      >
        Experience Timeline
      </motion.h2>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative pl-3 sm:pl-4 pt-8 w-full"
      >
        {timelineEntries.map((entry, index) => (
          <React.Fragment key={`${entry.type}-${entry.id}`}>
            {React.cloneElement(entry.component, { index })}
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  );
}
