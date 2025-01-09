import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { CharacterDynamicsD3 } from "./dynamics/CharacterDynamicsD3";
import { Timeline } from "./dynamics/Timeline";
import { CharacterNode, Relationship } from "./dynamics/types";

interface CharacterDynamicsProps {
  characters: CharacterNode[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();
  const [timelinePosition, setTimelinePosition] = useState(0);

  // Sample characters for demonstration
  const sampleCharacters: CharacterNode[] = [
    { 
      id: "1", 
      name: "Hero", 
      role: "Protagonist",
      backstory: "A humble beginning",
      goals: "Save the world",
      traits: ["brave", "determined"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "2", 
      name: "Mentor", 
      role: "Guide",
      backstory: "Ancient wisdom keeper",
      goals: "Guide the hero",
      traits: ["wise", "mysterious"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "3", 
      name: "Ally", 
      role: "Support",
      backstory: "Always by the hero's side",
      goals: "Assist the hero",
      traits: ["loyal", "courageous"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "4", 
      name: "Rival", 
      role: "Antagonist",
      backstory: "A fierce competitor",
      goals: "Defeat the hero",
      traits: ["ambitious", "clever"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "5", 
      name: "Friend", 
      role: "Support",
      backstory: "A trusted companion",
      goals: "Support the hero",
      traits: ["friendly", "helpful"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "6", 
      name: "Enemy", 
      role: "Antagonist",
      backstory: "A dark force",
      goals: "Stop the hero",
      traits: ["malicious", "powerful"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "7", 
      name: "Sidekick", 
      role: "Support",
      backstory: "The hero's loyal friend",
      goals: "Help the hero succeed",
      traits: ["funny", "brave"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "8", 
      name: "Love", 
      role: "Interest",
      backstory: "The hero's love interest",
      goals: "Support the hero emotionally",
      traits: ["caring", "supportive"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: "9", 
      name: "Nemesis", 
      role: "Villain",
      backstory: "The hero's greatest foe",
      goals: "Defeat the hero",
      traits: ["ruthless", "intelligent"],
      story_id: "sample-story",
      user_id: "sample-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Sample relationships with varying types and strengths
  const sampleRelationships: Relationship[] = [
    { source: sampleCharacters[0], target: sampleCharacters[1], type: "mentor", strength: 85 },
    { source: sampleCharacters[0], target: sampleCharacters[2], type: "ally", strength: 75 },
    { source: sampleCharacters[0], target: sampleCharacters[3], type: "rival", strength: 90 },
    { source: sampleCharacters[0], target: sampleCharacters[4], type: "friend", strength: 95 },
    { source: sampleCharacters[0], target: sampleCharacters[5], type: "enemy", strength: 80 },
    { source: sampleCharacters[1], target: sampleCharacters[2], type: "ally", strength: 60 },
    { source: sampleCharacters[2], target: sampleCharacters[4], type: "friend", strength: 70 },
    { source: sampleCharacters[3], target: sampleCharacters[5], type: "ally", strength: 65 },
    { source: sampleCharacters[6], target: sampleCharacters[0], type: "friend", strength: 85 },
    { source: sampleCharacters[7], target: sampleCharacters[0], type: "lover", strength: 95 },
    { source: sampleCharacters[8], target: sampleCharacters[0], type: "enemy", strength: 100 },
    { source: sampleCharacters[4], target: sampleCharacters[7], type: "friend", strength: 55 }
  ];

  const { data: relationships = [] } = useQuery({
    queryKey: ["character_relationships", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return sampleRelationships;
      
      const { data: relationshipsData, error } = await supabase
        .from("character_relationships")
        .select(`
          id,
          relationship_type,
          strength,
          character1:characters!character1_id(id, name, role, backstory, goals, traits, story_id, user_id, created_at, updated_at),
          character2:characters!character2_id(id, name, role, backstory, goals, traits, story_id, user_id, created_at, updated_at)
        `)
        .eq("story_id", selectedStory.id);

      if (error) throw error;

      return relationshipsData.length > 0 
        ? relationshipsData.map((rel) => ({
            source: rel.character1 as CharacterNode,
            target: rel.character2 as CharacterNode,
            type: rel.relationship_type,
            strength: rel.strength || 50,
          })) 
        : sampleRelationships;
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
