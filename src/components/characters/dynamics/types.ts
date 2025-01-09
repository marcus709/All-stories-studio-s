import { Character } from '@/integrations/supabase/types/tables.types';

export interface CharacterNode extends Character {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface RelationshipLink {
  source: CharacterNode;
  target: CharacterNode;
  type: string;
  strength: number;
}

export interface CharacterDynamicsD3Props {
  characters: CharacterNode[];
  relationships: {
    id: string;
    story_id: string;
    character1_id: string;
    character2_id: string;
    relationship_type: string;
    strength: number;
    created_at: string;
  }[];
}