import { Json } from "@/integrations/supabase/types";

export interface Character {
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
  skills: Json | null;
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
  social_masks: Json | null;
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
  skill_trees: Json | null;
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
}