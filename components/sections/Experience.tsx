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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function ExperienceCard({
  experience,
  index,
}: {
  experience: WorkExperience;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedDates, setFormattedDates] = useState({
    start: "",
    end: "Present",
  });

  const { id, job_title, description, tags, job_type, url, company, location } =
    experience;

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
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        damping: 25,
      }}
      className="scroll-mt-16 w-full"
    >
      <Card className="overflow-hidden w-full">
        <CardHeader className="p-3 sm:p-4 md:p-6 pb-0 sm:pb-0 md:pb-0">
          <div className="flex flex-col gap-0.5 sm:gap-1 sm:flex-row sm:justify-between">
            <div className="space-y-0">
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
              {formattedDates.start} - {formattedDates.end}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-1 sm:pt-1 md:pt-1 mt-[-4px]">
          <div className="space-y-2 sm:space-y-3">
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
              <div className="space-y-1.5 sm:space-y-2 mt-1">
                {Object.entries(tagsByType).map(([type, typeTags]) => (
                  <div key={type} className="space-y-1">
                    <h4 className="text-xs font-medium text-zinc-500">
                      {type}
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {typeTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs px-2.5 py-0.5"
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

  // Separate main and non-main experiences
  const mainExperiences = experiences.filter((exp) => exp.main);
  const otherExperiences = experiences.filter((exp) => !exp.main);

  return (
    <section id="experience-section" className="space-y-6 w-full">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
        Work Experience
      </h2>
      <div className="grid gap-4 sm:gap-6 w-full">
        {mainExperiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} />
        ))}
      </div>

      {otherExperiences.length > 0 && (
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="more-experiences" className="border-none">
              <AccordionTrigger className="py-2 text-base sm:text-lg font-semibold">
                More Experiences
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 sm:gap-6 w-full pt-4">
                  {otherExperiences.map((exp, index) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      index={index}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </section>
  );
}
