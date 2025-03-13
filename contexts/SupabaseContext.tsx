"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type {
  WorkExperience,
  Interest,
  EducationExperience,
} from "@/types/supabase";
import { supabase } from "@/lib/supabase/client";

type SupabaseContextType = {
  experiences: WorkExperience[];
  interests: Interest[];
  education: EducationExperience[];
  loading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  experiences: [],
  interests: [],
  education: [],
  loading: true,
  error: null,
});

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

type RPCResponse = {
  work_experience_id: number;
  job_title: string;
  description: string;
  start_date: string;
  company: string;
  location: string;
  end_date: string | null;
  relevant_link: string | null;
  job_type_id: number;
  job_type_name: string;
  main: boolean;
  tags: Array<{
    tag_id: number;
    tag_name: string;
    tag_type: string;
  }>;
};

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [education, setEducation] = useState<EducationExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log("Starting data fetch...");

        // Fetch work experiences
        const { data: expData, error: fetchError } = await supabase.rpc(
          "get_work_experience"
        );

        if (fetchError) {
          console.error("Work experience fetch error:", fetchError);
          throw new Error(`Work experience fetch error: ${fetchError.message}`);
        }

        console.log("Work experiences fetched:", expData);

        // Fetch interests
        const { data: interestsData, error: interestsError } = await supabase
          .from("interests")
          .select("*")
          .order("id");

        if (interestsError) {
          console.error("Interests fetch error:", interestsError);
          throw new Error(`Interests fetch error: ${interestsError.message}`);
        }

        console.log("Interests fetched:", interestsData);

        // Fetch education experiences
        const { data: educationData, error: educationError } = await supabase
          .from("education_experience")
          .select("*")
          .order("start_date", { ascending: false });

        if (educationError) {
          console.error("Education fetch error:", educationError);
          throw new Error(`Education fetch error: ${educationError.message}`);
        }

        console.log("Education data fetched:", educationData);

        // Transform the RPC data to match our WorkExperience type
        const transformedExperiences = (expData as RPCResponse[]).map(
          (exp) => ({
            id: exp.work_experience_id,
            job_title: exp.job_title,
            description: exp.description,
            location: exp.location,
            company: exp.company,
            start_date: exp.start_date,
            end_date: exp.end_date,
            url: exp.relevant_link,
            main: exp.main,
            job_type: {
              id: exp.job_type_id,
              type: exp.job_type_name,
            },
            tags: exp.tags.map((tag) => ({
              id: tag.tag_id,
              name: tag.tag_name,
              type: tag.tag_type,
            })),
          })
        );

        console.log("Data transformation complete:", {
          experiences: transformedExperiences.length,
          interests: interestsData.length,
          education: educationData.length,
        });

        setExperiences(transformedExperiences);
        setInterests(interestsData);
        setEducation(educationData);
      } catch (err) {
        console.error("Detailed error:", {
          error: err,
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
        });
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{ experiences, interests, education, loading, error }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}
