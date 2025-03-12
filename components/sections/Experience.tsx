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
  console.log("Rendering experience:", experience);
  const { job_title, description, start_date, end_date, tags, job_type } =
    experience;

  console.log("Job type:", job_type);
  console.log("Tags:", tags);

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
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{job_title}</CardTitle>
                {job_type && (
                  <Badge variant="secondary" className="font-normal">
                    {job_type.type}
                  </Badge>
                )}
              </div>
            </div>
            <span className="text-sm text-zinc-500">
              {startDateFormatted} - {endDateFormatted}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p
                className={`text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line ${
                  !isExpanded ? "line-clamp-4" : ""
                }`}
              >
                {description}
              </p>
              {description.length > 200 && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "See less" : "See more"}
                </Button>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="space-y-3">
                {Object.entries(tagsByType).map(([type, typeTags]) => (
                  <div key={type} className="space-y-1.5">
                    <h4 className="text-sm font-medium text-zinc-500">
                      {type}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {typeTags.map((tag) => (
                        <Badge key={tag.id} variant="outline">
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!experiences || experiences.length === 0)
    return <div>No experiences found</div>;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
      <div className="grid gap-6">
        {experiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
}
