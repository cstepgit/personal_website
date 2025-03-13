"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabase } from "@/contexts/SupabaseContext";
import type { EducationExperience } from "@/types/supabase";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function EducationCard({
  education,
  index,
}: {
  education: EducationExperience;
  index: number;
}) {
  const { university, degree, degree_type, gpa } = education;
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
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        type: "spring",
        damping: 20,
      }}
      className="w-full"
    >
      <Card className="overflow-hidden w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-1">
            <div className="max-w-[75%] space-y-0.5">
              <CardTitle className="text-base sm:text-lg md:text-xl break-words">
                {degree_type} in {degree}
              </CardTitle>
              <p className="text-xs text-zinc-500">{university}</p>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <span className="text-xs text-zinc-500">
                {formattedDates.start} - {formattedDates.end}
              </span>
              <span className="text-xs text-zinc-500">
                GPA: {gpa.toFixed(2)}
              </span>
            </div>
          </div>
        </CardHeader>
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
    <section id="education-section" className="space-y-6 w-full">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
        Education
      </h2>
      <div className="grid gap-4 sm:gap-6 w-full">
        {education.map((edu, index) => (
          <EducationCard key={edu.id} education={edu} index={index} />
        ))}
      </div>
    </section>
  );
}
