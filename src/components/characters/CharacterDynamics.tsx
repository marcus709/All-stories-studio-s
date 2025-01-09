import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterDynamicsD3 } from './dynamics/CharacterDynamicsD3';

// Dummy characters for development
const dummyCharacters = [
  {
    id: '1',
    name: 'John Hero',
    role: 'Protagonist',
    user_id: '1',
    traits: ['brave', 'loyal'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Mentor',
    role: 'Mentor',
    user_id: '1',
    traits: ['wise', 'mysterious'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Dark Antagonist',
    role: 'Villain',
    user_id: '1',
    traits: ['cunning', 'ruthless'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Loyal Friend',
    role: 'Ally',
    user_id: '1',
    traits: ['supportive', 'reliable'],
    created_at: new Date().toISOString()
  }
] as Character[];

// Dummy relationships for development
const dummyRelationships = [
  {
    id: '1',
    story_id: '1',
    character1_id: '1',
    character2_id: '2',
    relationship_type: 'mentor',
    strength: 80,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    story_id: '1',
    character1_id: '1',
    character2_id: '3',
    relationship_type: 'enemy',
    strength: 90,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    story_id: '1',
    character1_id: '1',
    character2_id: '4',
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