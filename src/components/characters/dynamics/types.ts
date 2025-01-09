import { Character } from "@/integrations/supabase/types/tables.types";

export interface CharacterNode extends Pick<Character, 'id' | 'name' | 'role'> {
  x?: number;
  y?: number;
}

export type RelationshipType = 'friend' | 'enemy' | 'family' | 'mentor' | 'student' | 'rival' | 'lover' | 'ally' | 'neutral';

export interface Relationship {
  source: CharacterNode;
  target: CharacterNode;
  type: RelationshipType;
  strength: number;
}

export type TensionPointType = 'rising' | 'falling' | 'climax' | 'resolution';

export interface TensionPoint {
  id: string;
  story_id: string;
  position: number;
  tension_level: number;
  description: string | null;
  type: TensionPointType;
}