"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { WorkExperience } from "@/types/supabase";
import { supabase } from "@/lib/supabase/client";

type SupabaseContextType = {
  experiences: WorkExperience[];
  loading: boolean;
  error: Error | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
  experiences: [],
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
  end_date: string | null;
  job_type_id: number;
  job_type_name: string;
  tags: Array<{
    tag_id: number;
    tag_name: string;
    tag_type: string;
  }>;
};

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase.rpc(
          "get_work_experience"
        );

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }

        console.log("Raw data from RPC:", data);

        // Transform the RPC data to match our WorkExperience type
        const transformedExperiences = (data as RPCResponse[]).map((exp) => ({
          id: exp.work_experience_id,
          job_title: exp.job_title,
          description: exp.description,
          start_date: exp.start_date,
          end_date: exp.end_date,
          job_type: {
            id: exp.job_type_id,
            type: exp.job_type_name,
          },
          tags: exp.tags.map((tag) => ({
            id: tag.tag_id,
            name: tag.tag_name,
            type: tag.tag_type,
          })),
        }));

        console.log("Transformed experiences:", transformedExperiences);
        setExperiences(transformedExperiences);
      } catch (err) {
        console.error("Error fetching data:", err);
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
    <SupabaseContext.Provider value={{ experiences, loading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}
