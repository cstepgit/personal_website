export type Tag = {
  name: string;
  type?: string;
  color?: string;
};

export type WorkExperience = {
  id: number;
  job_title: string;
  start_date: string;
  end_date: string | null;
  company: string;
  location: string;
  description: string;
  tags: Tag[] | null;
  relevant_link: string | null;
};

export type Database = {
  public: {
    Tables: {
      work_experience: {
        Row: WorkExperience;
        Insert: Omit<WorkExperience, "id">;
        Update: Partial<Omit<WorkExperience, "id">>;
      };
    };
  };
};
