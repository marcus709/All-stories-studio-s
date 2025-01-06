export type StoryStatus = 'draft' | 'published' | 'archived';

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
  description?: string | null;
  user_id: string;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  traits?: string[];
  goals?: string;
  backstory?: string;
  story_id?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentContent {
  type: string;
  content: string;
}

export interface Document {
  id: string;
  story_id: string;
  user_id: string;
  title: string;
  content: DocumentContent[];
  created_at?: string;
  updated_at?: string;
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