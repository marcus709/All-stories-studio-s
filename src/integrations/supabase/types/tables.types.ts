import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];

export type Character = {
  id: string;
  name: string;
  role: string | null;
  traits: string[] | null;
  goals: string | null;
  backstory: string | null;
  story_id: string | null;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  psychology: {
    fears: string[];
    mental_health: string | null;
    coping_mechanisms: string[];
    emotional_tendencies: string[];
  } | null;
  values_and_morals: {
    honesty: number;
    loyalty: number;
    alignment: {
      lawful_chaotic: number;
      selfless_selfish: number;
    };
    risk_taking: number;
  } | null;
  skills: any[] | null;
  flaws: string[] | null;
  archetype: string | null;
  psychological_traits: {
    trust: number;
    resilience: number;
    impulsiveness: number;
    emotional_intelligence: number;
  } | null;
  internal_motivations: string[] | null;
  external_goals: string[] | null;
  core_beliefs: string[] | null;
  social_masks: any[] | null;
  group_roles: string[] | null;
  behavioral_quirks: string[] | null;
  body_language: string | null;
  cultural_background: {
    taboos: string[];
    traditions: string[];
    religious_beliefs: string[];
  } | null;
  life_events: {
    losses: string[];
    formative: string[];
    turning_points: string[];
  } | null;
  ancestry: string | null;
  skill_trees: any[] | null;
  expertise: {
    areas: string[];
    limitations: string[];
  } | null;
  training_history: string[] | null;
  dialogue_style: {
    tone: string[];
    patterns: string[];
    formality: string;
  } | null;
  iconic_phrases: string[] | null;
  linguistic_traits: {
    accent: string | null;
    quirks: string[];
    languages: string[];
  } | null;
};

export type Comment = Tables["comments"]["Row"];
export type Friendship = Tables["friendships"]["Row"];
export type GroupMember = Tables["group_members"]["Row"];
export type Group = Tables["groups"]["Row"];
export type PlotEvent = Tables["plot_events"]["Row"];
export type PlotStructure = Tables["plot_structures"]["Row"];
export type PostLike = Tables["post_likes"]["Row"];
export type PostTag = Tables["post_tags"]["Row"];
export type Post = Tables["posts"]["Row"];
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website?: string | null;
};
export type SavedPost = Tables["saved_posts"]["Row"];
export type Story = Tables["stories"]["Row"];
export type StoryIdea = Tables["story_ideas"]["Row"];
export type Topic = Tables["topics"]["Row"];