import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { TensionTimeline } from "./dynamics/TensionTimeline";
import { CharacterDynamicsFlow } from "./dynamics/CharacterDynamicsFlow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Character } from "@/types/character";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

type RelationshipType = "friend" | "ally" | "rival" | "enemy" | "family" | "mentor" | "student" | "romantic";

interface CharacterDynamicsProps {
  characters: Character[];
}

export const CharacterDynamics = ({ characters }: CharacterDynamicsProps) => {
  const { selectedStory } = useStory();
  const [addRelationshipOpen, setAddRelationshipOpen] = useState(false);
  const [character1, setCharacter1] = useState<string>("");
  const [character2, setCharacter2] = useState<string>("");
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("friend");
  const [strength, setStrength] = useState<number>(50);
  const [trust, setTrust] = useState<number>(50);
  const [conflict, setConflict] = useState<number>(20);
  const [description, setDescription] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const addRelationshipMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStory || !character1 || !character2 || character1 === character2) {
        throw new Error("Please select different characters");
      }

      const { data, error } = await supabase
        .from("character_relationships")
        .insert({
          story_id: selectedStory.id,
          character1_id: character1,
          character2_id: character2,
          relationship_type: relationshipType,
          strength: strength,
          description: description,
          trust: trust,
          conflict: conflict
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character_relationships"] });
      toast({
        title: "Success",
        description: "Relationship added successfully",
      });
      setAddRelationshipOpen(false);
      resetRelationshipForm();
    },
    onError: (error) => {
      console.error("Error adding relationship:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add relationship",
        variant: "destructive",
      });
    },
  });

  const resetRelationshipForm = () => {
    setCharacter1("");
    setCharacter2("");
    setRelationshipType("friend");
    setStrength(50);
    setTrust(50);
    setConflict(20);
    setDescription("");
  };

  const handleAddRelationship = () => {
    addRelationshipMutation.mutate();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900">
      <div className="h-14 border-b border-gray-800 px-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Character Dynamics</h2>
        <Button 
          onClick={() => setAddRelationshipOpen(true)}
          className="bg-purple-500 hover:bg-purple-600 gap-2"
          disabled={characters.length < 2}
        >
          <Plus className="h-4 w-4" />
          Add Relationship
        </Button>
      </div>
      
      <div className="flex-1 min-h-0">
        <CharacterDynamicsFlow 
          characters={characters} 
          relationships={relationships || []} 
        />
      </div>
      
      <div className="h-32 border-t border-gray-800">
        <TensionTimeline tensionPoints={tensionPoints || []} />
      </div>

      <Dialog open={addRelationshipOpen} onOpenChange={setAddRelationshipOpen}>
        <DialogContent className="sm:max-w-[550px] bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Add Character Relationship</DialogTitle>
            <DialogDescription className="text-gray-400">
              Define how two characters relate to each other in your story.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">First Character</Label>
                <Select value={character1} onValueChange={setCharacter1}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Second Character</Label>
                <Select value={character2} onValueChange={setCharacter2}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Relationship Type</Label>
              <Select 
                value={relationshipType} 
                onValueChange={(value: RelationshipType) => setRelationshipType(value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="ally">Ally</SelectItem>
                  <SelectItem value="rival">Rival</SelectItem>
                  <SelectItem value="enemy">Enemy</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-white">Relationship Strength: {strength}%</Label>
                </div>
                <Slider 
                  value={[strength]} 
                  min={1} 
                  max={100} 
                  step={1} 
                  onValueChange={(value) => setStrength(value[0])} 
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-white">Trust Level: {trust}%</Label>
                </div>
                <Slider 
                  value={[trust]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => setTrust(value[0])} 
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-white">Conflict Level: {conflict}%</Label>
                </div>
                <Slider 
                  value={[conflict]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => setConflict(value[0])} 
                  className="py-4"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Description (Optional)</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details about their relationship..."
                className="w-full rounded-md bg-gray-800 border-gray-700 text-white p-2 min-h-[80px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAddRelationshipOpen(false);
                  resetRelationshipForm();
                }}
                className="border-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddRelationship}
                disabled={!character1 || !character2 || character1 === character2 || addRelationshipMutation.isPending}
                className="bg-purple-500 hover:bg-purple-600"
              >
                {addRelationshipMutation.isPending ? 'Adding...' : 'Add Relationship'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
