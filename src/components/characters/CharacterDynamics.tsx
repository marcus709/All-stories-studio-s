import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterDynamicsD3 } from './dynamics/CharacterDynamicsD3';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
import { CharacterNode, Relationship } from './dynamics/types';

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();

  const { data: relationshipData } = useQuery({
    queryKey: ['character-relationships', selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      
      const { data, error } = await supabase
        .from('character_relationships')
        .select('*')
        .eq('story_id', selectedStory.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  // Transform characters into nodes with initial positions
  const characterNodes: CharacterNode[] = characters.map(char => ({
    ...char,
    x: 0,
    y: 0,
    fx: null,
    fy: null
  }));

  // Transform the relationships data to match the expected format
  const relationships: Relationship[] = (relationshipData || []).map(rel => {
    const source = characterNodes.find(c => c.id === rel.character1_id);
    const target = characterNodes.find(c => c.id === rel.character2_id);
    
    if (!source || !target) return null;
    
    return {
      source,
      target,
      type: rel.relationship_type,
      strength: rel.strength || 50
    };
  }).filter((rel): rel is Relationship => rel !== null);

  return (
    <div className="w-full h-full">
      <CharacterDynamicsD3 
        characters={characterNodes}
        relationships={relationships}
      />
    </div>
  );
};