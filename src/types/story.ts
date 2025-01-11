export type StoryStatus = 'draft' | 'published' | 'archived';

export interface Story {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  is_shared_space?: boolean;
  shared_group_id?: string | null;
}

export interface CreateStoryInput {
  title: string;
  description?: string | null;
  user_id: string;
  is_shared_space?: boolean;
  shared_group_id?: string | null;
}

export interface Document {
  id: string;
  story_id: string;
  user_id: string;
  title: string;
  content: string;
  time_period?: string;
  time_period_details?: {
    language: string;
    culture: string;
    environment: string;
  };
  created_at: string | null;
  updated_at?: string | null;
}

export type StoryIssueType = 'plot_hole' | 'timeline_inconsistency' | 'pov_inconsistency' | 'character_inconsistency' | 'setting_inconsistency' | 'logic_flaw';

export interface StoryIssue {
  id: string;
  analysis_id: string;
  issue_type: StoryIssueType;
  description: string;
  location?: string;
  severity?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}