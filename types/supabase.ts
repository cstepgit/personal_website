export type Tag = {
  id: number;
  name: string;
  type: string;
};

export type JobType = {
  id: number;
  type: string;
};

export type Interest = {
  id: number;
  interest: string;
  projects?: string[];
  active_learning?: string[];
};

export type EducationExperience = {
  id: number;
  university: string;
  degree: string;
  degree_type: string;
  start_date: string;
  end_date: string | null;
  gpa: number;
};

export type WorkExperience = {
  id: number;
  job_title: string;
  company: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string | null;
  url: string | null;
  job_type: JobType;
  tags: Tag[];
};

export type Database = {
  public: {
    Tables: {
      work_experience: {
        Row: Omit<WorkExperience, "tags" | "job_type">;
        Insert: Omit<WorkExperience, "id" | "tags" | "job_type">;
        Update: Partial<Omit<WorkExperience, "id" | "tags" | "job_type">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id">;
        Update: Partial<Omit<Tag, "id">>;
      };
      job_type: {
        Row: JobType;
        Insert: Omit<JobType, "id">;
        Update: Partial<Omit<JobType, "id">>;
      };
      interests: {
        Row: Interest;
        Insert: Omit<Interest, "id">;
        Update: Partial<Omit<Interest, "id">>;
      };
      education_experience: {
        Row: EducationExperience;
        Insert: Omit<EducationExperience, "id">;
        Update: Partial<Omit<EducationExperience, "id">>;
      };
    };
  };
};
