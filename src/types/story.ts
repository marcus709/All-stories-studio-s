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
  created_at: string;
  updated_at: string;
  user_id?: string; // Made optional since it's not always needed when displaying stories
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