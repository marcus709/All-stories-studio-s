import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { CharacterDynamicsD3 } from "./dynamics/CharacterDynamicsD3";
import { Timeline } from "./dynamics/Timeline";
import { Character } from "@/integrations/supabase/types/tables.types";
import { CharacterNode, Relationship, RelationshipType } from "./dynamics/types";

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();
  const [timelinePosition, setTimelinePosition] = useState(0);

  const { data: relationships = [] } = useQuery({
    queryKey: ["character_relationships", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("character_relationships")
        .select(`
          *,
          character1:character1_id(id, name, role),
          character2:character2_id(id, name, role)
        `)
        .eq("story_id", selectedStory.id);
      if (error) throw error;
      return data.map((rel) => ({
        source: rel.character1 as CharacterNode,
        target: rel.character2 as CharacterNode,
        type: rel.relationship_type as RelationshipType,
        strength: rel.strength || 50,
      }));
    },
    enabled: !!selectedStory?.id,
  });

  const characterNodes: CharacterNode[] = characters.map((char) => ({
    id: char.id,
    name: char.name,
    role: char.role,
  }));

  return (
    <div className="space-y-8 p-6">
      <Timeline
        position={timelinePosition}
        onPositionChange={(value) => setTimelinePosition(value[0])}
      />
      <CharacterDynamicsD3 
        characters={characterNodes} 
        relationships={relationships} 
      />
    </div>
  );
};