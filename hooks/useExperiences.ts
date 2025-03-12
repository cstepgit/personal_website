import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface Experience {
  id: number;
  job_title: string;
  company: string;
  location: string;
  description: string;
  tags: { name: string; type: string; color?: string }[];
  relevant_link: string | null;
}

export function useExperiences() {
  const supabase = useSupabaseClient();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          throw error;
        }

        setExperiences(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, [supabase]);

  return { experiences, loading, error };
}
