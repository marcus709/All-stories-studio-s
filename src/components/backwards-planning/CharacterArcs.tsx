import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export const CharacterArcs = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: characters } = useQuery({
    queryKey: ["characters", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("story_id", selectedStory.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: arcPoints } = useQuery({
    queryKey: ["characterArcPoints", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("character_arc_points")
        .select("*")
        .eq("story_id", selectedStory.id);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Character Arcs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters?.map(character => (
            <CharacterArcCard
              key={character.id}
              character={character}
              arcPoints={arcPoints?.filter(point => point.character_id === character.id) || []}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

const CharacterArcCard = ({ character, arcPoints }: any) => {
  const [newPoint, setNewPoint] = useState({
    emotional_state: "",
    decisions: [],
    goals: [],
    conflicts: [],
  });

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-lg mb-4">{character.name}</h3>
      
      <div className="space-y-4">
        {arcPoints.map((point: any) => (
          <div key={point.id} className="border-t pt-4">
            <p className="font-medium">Emotional State: {point.emotional_state}</p>
            
            <div className="mt-2">
              <p className="text-sm font-medium">Decisions:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {point.decisions.map((decision: string) => (
                  <Badge key={decision} variant="secondary">
                    {decision}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium">Goals:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {point.goals.map((goal: string) => (
                  <Badge key={goal} variant="secondary">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium">Conflicts:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {point.conflicts.map((conflict: string) => (
                  <Badge key={conflict} variant="secondary">
                    {conflict}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};