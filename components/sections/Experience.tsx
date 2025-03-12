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

function ExperienceCard({ experience }: { experience: WorkExperience }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    job_title,
    company,
    location,
    description,
    start_date,
    end_date,
    tags,
    relevant_link,
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>{job_title}</CardTitle>
              {relevant_link && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  asChild
                  title="Live Project Link"
                >
                  <a
                    href={relevant_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Live Project Link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
            <CardDescription>
              {company} • {location}
            </CardDescription>
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
              className={`text-zinc-600 dark:text-zinc-400 whitespace-pre-line ${
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

          {tags && (
            <div className="flex flex-wrap gap-2">
              {Array.isArray(tags) ? (
                tags.map((tag: Tag) => (
                  <Badge
                    key={`${tag.name}-${tag.type || ""}`}
                    variant="outline"
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">No tags</Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  );
}
