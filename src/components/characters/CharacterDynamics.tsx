import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { TensionTimeline } from "./dynamics/TensionTimeline";
import { CharacterDynamicsFlow } from "./dynamics/CharacterDynamicsFlow";
import { Character } from "@/types/character";

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
      
      // Parse JSON fields to ensure correct typing
      return (data || []).map(char => ({
        ...char,
        psychology: char.psychology as Character['psychology'],
        values_and_morals: char.values_and_morals as Character['values_and_morals'],
        cultural_background: char.cultural_background as Character['cultural_background'],
        psychological_traits: char.psychological_traits as Character['psychological_traits'],
        dialogue_style: char.dialogue_style as Character['dialogue_style'],
        linguistic_traits: char.linguistic_traits as Character['linguistic_traits'],
        life_events: char.life_events as Character['life_events'],
        expertise: char.expertise as Character['expertise']
      })) as Character[];
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

  const { data: tensionPoints } = useQuery({
    queryKey: ["timeline_tension_points", selectedStory?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("timeline_tension_points")
        .select("*")
        .eq("story_id", selectedStory?.id)
        .order("position", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900">
      <div className="flex-1 min-h-0">
        <CharacterDynamicsFlow 
          characters={characters || []} 
          relationships={relationships || []} 
        />
      </div>
      <div className="h-32 border-t border-gray-800">
        <TensionTimeline tensionPoints={tensionPoints || []} />
      </div>
    </div>
  );
};
