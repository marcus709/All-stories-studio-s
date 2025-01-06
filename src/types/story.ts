export type StoryStatus = 'draft' | 'published' | 'archived';

export interface Story {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
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
