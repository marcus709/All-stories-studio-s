import { Json } from "@/integrations/supabase/types";

export type StoryIssueType = 
  | "plot_hole"
  | "timeline_inconsistency"
  | "pov_inconsistency"
  | "character_inconsistency"
  | "setting_inconsistency"
  | "logic_flaw";

export interface Story {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateStoryInput {
  title: string;
  description: string | null;
  user_id: string;
}

export interface StoryIssue {
  id: string;
  analysis_id: string;
  issue_type: StoryIssueType;
  description: string;
  location: string;
  severity: number;
  status: "open" | "resolved";
  created_at?: string;
  updated_at?: string;
}

export interface DocumentContent {
  type: string;
  content: string;
  version?: string;  // Made version optional
}

export interface Document {
  id: string;
  title: string;
  content: DocumentContent[] | Json;
  story_id: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface DocumentAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  hasMinimalContent: boolean;
}