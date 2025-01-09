import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { CharacterDynamicsD3 } from "./dynamics/CharacterDynamicsD3";
import { TensionTimeline } from "./dynamics/TensionTimeline";

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
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <CharacterDynamicsD3 
          characters={characters || []} 
          relationships={relationships || []} 
        />
      </div>
      <div className="h-32 border-t">
        <TensionTimeline tensionPoints={tensionPoints || []} />
      </div>
    </div>
  );
};