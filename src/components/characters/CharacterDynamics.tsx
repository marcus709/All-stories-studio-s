import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { CharacterDynamicsD3 } from "./dynamics/CharacterDynamicsD3";
import { Timeline } from "./dynamics/Timeline";
import { CharacterNode, Relationship } from "./dynamics/types";

interface CharacterDynamicsProps {
  characters: any[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();
  const [timelinePosition, setTimelinePosition] = useState(0);

  // Sample characters for demonstration
  const sampleCharacters: CharacterNode[] = [
    { id: "1", name: "Frodo", role: "Protagonist" },
    { id: "2", name: "Sam", role: "Deuteragonist" },
    { id: "3", name: "Gandalf", role: "Mentor" },
    { id: "4", name: "Aragorn", role: "Ally" },
    { id: "5", name: "Gollum", role: "Antagonist" },
    { id: "6", name: "Bilbo", role: "Mentor" },
    { id: "7", name: "Merry", role: "Supporting" },
    { id: "8", name: "Pippin", role: "Supporting" },
    { id: "9", name: "Saruman", role: "Antagonist" },
    { id: "10", name: "Boromir", role: "Supporting" },
  ];

  // Sample relationships for demonstration
  const sampleRelationships: Relationship[] = [
    { source: sampleCharacters[0], target: sampleCharacters[1], type: "friend", strength: 90 },
    { source: sampleCharacters[0], target: sampleCharacters[2], type: "mentor", strength: 75 },
    { source: sampleCharacters[0], target: sampleCharacters[4], type: "enemy", strength: 85 },
    { source: sampleCharacters[1], target: sampleCharacters[2], type: "ally", strength: 60 },
    { source: sampleCharacters[2], target: sampleCharacters[3], type: "ally", strength: 80 },
    { source: sampleCharacters[3], target: sampleCharacters[0], type: "ally", strength: 70 },
    { source: sampleCharacters[5], target: sampleCharacters[0], type: "family", strength: 85 },
    { source: sampleCharacters[6], target: sampleCharacters[7], type: "friend", strength: 95 },
    { source: sampleCharacters[8], target: sampleCharacters[2], type: "rival", strength: 88 },
    { source: sampleCharacters[9], target: sampleCharacters[0], type: "ally", strength: 65 },
    { source: sampleCharacters[9], target: sampleCharacters[3], type: "ally", strength: 75 },
    { source: sampleCharacters[6], target: sampleCharacters[0], type: "friend", strength: 80 },
    { source: sampleCharacters[7], target: sampleCharacters[0], type: "friend", strength: 80 },
  ];

  const { data: relationships = [] } = useQuery({
    queryKey: ["character_relationships", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return sampleRelationships;
      const { data, error } = await supabase
        .from("character_relationships")
        .select(`
          *,
          character1:character1_id(id, name, role),
          character2:character2_id(id, name, role)
        `)
        .eq("story_id", selectedStory.id);
      if (error) throw error;
      return data.length > 0 ? data.map((rel) => ({
        source: rel.character1 as CharacterNode,
        target: rel.character2 as CharacterNode,
        type: rel.relationship_type,
        strength: rel.strength || 50,
      })) : sampleRelationships;
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="space-y-8 p-6">
      <Timeline
        position={timelinePosition}
        onPositionChange={(value) => setTimelinePosition(value[0])}
      />
      <CharacterDynamicsD3 
        characters={characters.length > 0 ? characters : sampleCharacters} 
        relationships={relationships}
      />
    </div>
  );
};