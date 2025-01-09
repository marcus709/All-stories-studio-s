export interface CharacterNode {
  id: string;
  name: string;
  role: string | null;
  backstory: string;
  goals: string;
  traits: string[];
  story_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
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