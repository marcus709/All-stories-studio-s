import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterDynamicsD3 } from './dynamics/CharacterDynamicsD3';

// Dummy characters for development
const dummyCharacters = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Hero',
    role: 'Protagonist',
    user_id: '123e4567-e89b-12d3-a456-426614174999',
    traits: ['brave', 'loyal'],
    created_at: new Date().toISOString()
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Sarah Mentor',
    role: 'Mentor',
    user_id: '123e4567-e89b-12d3-a456-426614174999',
    traits: ['wise', 'mysterious'],
    created_at: new Date().toISOString()
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Dark Antagonist',
    role: 'Villain',
    user_id: '123e4567-e89b-12d3-a456-426614174999',
    traits: ['cunning', 'ruthless'],
    created_at: new Date().toISOString()
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Loyal Friend',
    role: 'Ally',
    user_id: '123e4567-e89b-12d3-a456-426614174999',
    traits: ['supportive', 'reliable'],
    created_at: new Date().toISOString()
  }
] as Character[];

// Dummy relationships for development
const dummyRelationships = [
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    story_id: '123e4567-e89b-12d3-a456-426614174005',
    character1_id: '123e4567-e89b-12d3-a456-426614174000',
    character2_id: '123e4567-e89b-12d3-a456-426614174001',
    relationship_type: 'mentor',
    strength: 80,
    created_at: new Date().toISOString()
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    story_id: '123e4567-e89b-12d3-a456-426614174005',
    character1_id: '123e4567-e89b-12d3-a456-426614174000',
    character2_id: '123e4567-e89b-12d3-a456-426614174002',
    relationship_type: 'enemy',
    strength: 90,
    created_at: new Date().toISOString()
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    story_id: '123e4567-e89b-12d3-a456-426614174005',
    character1_id: '123e4567-e89b-12d3-a456-426614174000',
    character2_id: '123e4567-e89b-12d3-a456-426614174003',
    relationship_type: 'friend',
    strength: 85,
    created_at: new Date().toISOString()
  }
];

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  // For development, we'll use dummy data instead of the passed characters
  return <CharacterDynamicsD3 characters={dummyCharacters} relationships={dummyRelationships} />;
};