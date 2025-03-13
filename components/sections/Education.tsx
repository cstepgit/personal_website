"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/contexts/SupabaseContext";
import type { EducationExperience } from "@/types/supabase";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

function EducationCard({
  education,
  index,
}: {
  education: EducationExperience;
  index: number;
}) {
  const {
    university,
    degree,
    degree_type,
    gpa,
    relevant_courses,
    relevant_link,
  } = education;
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

  return (
    <motion.div
      id={`education-${education.id}`}
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        type: "spring",
        damping: 20,
      }}
      className="w-full scroll-mt-16"
    >
      <Card className="overflow-hidden w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-0 sm:pb-0 md:pb-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-1.5">
            <div className="space-y-0.5 sm:space-y-1 w-full sm:max-w-[75%]">
              <CardTitle className="text-base sm:text-lg md:text-xl break-words leading-tight">
                {degree_type} in {degree}
                {relevant_link && (
                  <a
                    href={relevant_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex ml-1.5 align-baseline"
                    aria-label={`Visit ${university} website`}
                  >
                    <ExternalLink className="size-3.5 sm:size-4" />
                  </a>
                )}
              </CardTitle>
              <p className="text-xs sm:text-sm text-zinc-500">{university}</p>
            </div>
            <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 sm:gap-0.5 mt-1 sm:mt-0 w-full sm:w-auto shrink-0">
              <span className="text-xs text-zinc-500">
                {formattedDates.start} - {formattedDates.end}
              </span>
              <span className="text-xs text-zinc-500 sm:text-right">
                GPA: {gpa.toFixed(2)}
              </span>
            </div>
          </div>
        </CardHeader>
        {relevant_courses && relevant_courses.length > 0 && (
          <CardContent className="p-3 sm:p-4 md:p-6 pt-1 sm:pt-1 md:pt-1 mt-[-4px]">
            <div className="space-y-1.5">
              <h4 className="text-xs font-medium text-zinc-500">
                Relevant Coursework
              </h4>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {relevant_courses.map((course) => (
                  <Badge
                    key={course}
                    variant="outline"
                    className="text-xs px-2.5 py-0.5"
                  >
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

export function Education() {
  const { education, loading, error } = useSupabase();

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!education || education.length === 0)
    return <div>No education found</div>;

  return (
    <section id="education-section" className="space-y-4 sm:space-y-6 w-full">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
        Education
      </h2>
      <div className="grid gap-3 sm:gap-4 w-full">
        {education.map((edu, index) => (
          <EducationCard key={edu.id} education={edu} index={index} />
        ))}
      </div>
    </section>
  );
}
