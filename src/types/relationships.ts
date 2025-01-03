export type RelationshipType = 'ally' | 'rival' | 'family' | 'friend' | 'enemy' | 'mentor' | 'student';

export interface Relationship {
  id: string;
  story_id: string;
  character1_id: string;
  character2_id: string;
  relationship_type: RelationshipType;
  description?: string;
  strength?: number;
  created_at?: string;
  updated_at?: string;
}