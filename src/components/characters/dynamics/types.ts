import { Character } from "@/integrations/supabase/types/tables.types";

export type RelationshipType = 'friend' | 'enemy' | 'family' | 'mentor' | 'student' | 'rival' | 'lover' | 'ally' | 'neutral';

export interface CharacterNode extends Character {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Relationship {
  source: CharacterNode;
  target: CharacterNode;
  type: RelationshipType;
  strength: number;
}

export interface TensionPoint {
  id: string;
  story_id: string;
  position: number;
  tension_level: number;
  description: string;
  type: 'rising' | 'climax' | 'falling' | 'resolution';
}

export interface CharacterDynamicsD3Props {
  characters: CharacterNode[];
  relationships: Relationship[];
}