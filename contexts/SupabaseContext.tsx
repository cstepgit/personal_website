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

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Simple direct query
        const { data, error } = await supabase
          .from("work_experience")
          .select("*");

        if (error) throw error;

        console.log("Fetched data:", data);
        setExperiences(data || []);
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
