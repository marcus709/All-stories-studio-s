export interface CharacterNode {
  id: string;
  name: string;
  role: string | null;
  backstory?: string | null;
  goals?: string | null;
  traits?: string[] | null;
  story_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string;
}

export type RelationshipType = 'friend' | 'enemy' | 'family' | 'mentor' | 'student' | 'lover' | 'rival' | 'ally' | 'neutral';

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