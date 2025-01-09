import { Character } from '@/integrations/supabase/types/tables.types';
import { CharacterDynamicsD3 } from './dynamics/CharacterDynamicsD3';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStory } from '@/contexts/StoryContext';

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();

  const { data: relationships } = useQuery({
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

  return (
    <div className="w-full h-full">
      <CharacterDynamicsD3 
        characters={characters} 
        relationships={relationships || []}
      />
    </div>
  );
};