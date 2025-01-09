import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterDynamicsD3 } from './dynamics/CharacterDynamicsD3';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';
import { Relationship } from './dynamics/types';

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

  // Transform the relationships data to match the expected format
  const relationships: Relationship[] = (relationshipData || []).map(rel => ({
    source: characters.find(c => c.id === rel.character1_id)!,
    target: characters.find(c => c.id === rel.character2_id)!,
    type: rel.relationship_type,
    strength: rel.strength || 50
  })).filter(rel => rel.source && rel.target); // Filter out any invalid relationships

  return (
    <div className="w-full h-full">
      <CharacterDynamicsD3 
        characters={characters} 
        relationships={relationships}
      />
    </div>
  );
};