export type View = "stories" | "characters" | "plot" | "formatting" | "docs";

export interface DashboardContentProps {
  view: View;
}

export interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  story_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  time_period?: string;
  time_period_details?: any;
}

export interface Story {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoryInput {
  title: string;
  description?: string;
  user_id: string;
}

export interface StoryIssue {
  id: string;
  analysis_id: string;
  issue_type: string;
  description: string;
  location?: string;
  severity?: number;
  status: string;
  created_at: string;
  updated_at: string;
}