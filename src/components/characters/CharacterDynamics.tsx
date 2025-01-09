import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { CharacterDynamicsD3 } from "./dynamics/CharacterDynamicsD3";

export const CharacterDynamics = () => {
  const { selectedStory } = useStory();

  const { data: characters } = useQuery({
    queryKey: ["characters", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("story_id", selectedStory?.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const { data: relationships } = useQuery({
    queryKey: ["character_relationships", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_relationships")
        .select("*")
        .eq("story_id", selectedStory?.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="w-full h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm">
      <CharacterDynamicsD3 
        characters={characters || []} 
        relationships={relationships || []} 
      />
    </div>
  );
};