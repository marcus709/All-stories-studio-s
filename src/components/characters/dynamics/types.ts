import { Character } from "@/integrations/supabase/types/tables.types";

export interface CharacterNode extends Character {
  x: number;
  y: number;
}

export interface Relationship {
  source: CharacterNode;
  target: CharacterNode;
  type: string;
  strength: number;
}

export interface CharacterDynamicsD3Props {
  characters: Character[];
  relationships: Relationship[];
}