import { Character } from "@/integrations/supabase/types/tables.types";

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