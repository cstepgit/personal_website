"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSupabase } from "@/contexts/SupabaseContext";
import { Badge } from "@/components/ui/badge";
import type { WorkExperience, Tag } from "@/types/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function ExperienceCard({
  experience,
  index,
}: {
  experience: WorkExperience;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    id,
    job_title,
    description,
    start_date,
    end_date,
    tags,
    job_type,
    url,
    company,
    location,
  } = experience;

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
      id={`experience-${id}`}
      initial={{ x: 100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        type: "spring",
        damping: 20,
      }}
      className="scroll-mt-16 w-full"
    >
      <Card className="overflow-hidden w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {url ? (
                    <span className="flex items-center gap-1.5">
                      <span className="break-words">{job_title}</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors flex-shrink-0"
                        aria-label={`Visit ${company} website`}
                      >
                        <ExternalLink className="size-3.5 sm:size-4" />
                      </a>
                    </span>
                  ) : (
                    <span className="break-words">{job_title}</span>
                  )}
                </CardTitle>
                {job_type && (
                  <Badge variant="secondary" className="font-normal text-xs">
                    {job_type.type}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-zinc-500">
                {company} • {location}
              </CardDescription>
            </div>
            <span className="text-xs text-zinc-500 shrink-0">
              {startDateFormatted} - {endDateFormatted}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p
                className={`text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line ${
                  !isExpanded ? "line-clamp-4" : ""
                }`}
              >
                {description}
              </p>
              {description.length > 200 && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "See less" : "See more"}
                </Button>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(tagsByType).map(([type, typeTags]) => (
                  <div key={type} className="space-y-1 sm:space-y-1.5">
                    <h4 className="text-xs font-medium text-zinc-500">
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Experience() {
  const { experiences, loading, error } = useSupabase();

  if (loading)
    return <div className="h-24 animate-pulse bg-muted rounded-md" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!experiences || experiences.length === 0)
    return <div>No experiences found</div>;

  return (
    <section id="experience-section" className="space-y-6 w-full">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
        Work Experience
      </h2>
      <div className="grid gap-4 sm:gap-6 w-full">
        {experiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
}
