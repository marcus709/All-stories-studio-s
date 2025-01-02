<lov-code>
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TopicPrivacy = "public" | "private" | "friends"

export type Topic = {
  id: string
  name: string
  description: string | null
  privacy: TopicPrivacy
  user_id: string
  created_at: string | null
  updated_at: string | null
}

export type Database = {
  public: {
    Tables: {
      characters: {
        Row: {
          backstory: string | null
          created_at: string | null
          goals: string | null
          id: string
          name: string
          role: string | null
          story_id: string | null
          traits: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backstory?: string | null
          created_at?: string | null
          goals?: string | null
          id?: string
          name: string
          role?: string | null
          story_id?: string | null
          traits?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backstory?: string | null