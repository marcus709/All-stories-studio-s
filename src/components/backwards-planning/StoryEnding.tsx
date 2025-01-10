import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface StoryEndingProps {
  initialData: any;
}

export const StoryEnding = ({ initialData }: StoryEndingProps) => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [ending, setEnding] = useState({
    final_scene: initialData?.final_scene || "",
    resolution: initialData?.resolution || "",
    key_themes: initialData?.key_themes || [],
    achievements: initialData?.achievements || "",
    character_outcomes: initialData?.character_outcomes || "",
  });
  
  const [newTheme, setNewTheme] = useState("");

  const saveEndingMutation = useMutation({
    mutationFn: async (data: typeof ending) => {
      if (!selectedStory?.id) return;

      const { error } = await supabase
        .from("backwards_story_endings")
        .upsert({
          story_id: selectedStory.id,
          ...data,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storyEnding"] });
      toast({
        title: "Success",
        description: "Story ending saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save story ending",
        variant: "destructive",
      });
    },
  });

  const handleAddTheme = () => {
    if (!newTheme.trim()) return;
    setEnding(prev => ({
      ...prev,
      key_themes: [...prev.key_themes, newTheme.trim()],
    }));
    setNewTheme("");
  };

  const handleRemoveTheme = (theme: string) => {
    setEnding(prev => ({
      ...prev,
      key_themes: prev.key_themes.filter(t => t !== theme),
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Define Your Story's Ending</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Final Scene
            </label>
            <Textarea
              placeholder="What happens in the climactic moment?"
              value={ending.final_scene}
              onChange={e => setEnding(prev => ({ ...prev, final_scene: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Resolution
            </label>
            <Textarea
              placeholder="How does the story wrap up for each major character or plotline?"
              value={ending.resolution}
              onChange={e => setEnding(prev => ({ ...prev, resolution: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Key Themes
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {ending.key_themes.map((theme) => (
                <Badge key={theme} variant="secondary" className="flex items-center gap-1">
                  {theme}
                  <button
                    onClick={() => handleRemoveTheme(theme)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a theme..."
                value={newTheme}
                onChange={e => setNewTheme(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleAddTheme()}
              />
              <Button onClick={handleAddTheme}>Add</Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Character Outcomes
            </label>
            <Textarea
              placeholder="Who succeeds, fails, or changes?"
              value={ending.character_outcomes}
              onChange={e => setEnding(prev => ({ ...prev, character_outcomes: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Key Achievements
            </label>
            <Textarea
              placeholder="What must be achieved by the end?"
              value={ending.achievements}
              onChange={e => setEnding(prev => ({ ...prev, achievements: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={() => saveEndingMutation.mutate(ending)}
            disabled={saveEndingMutation.isPending}
          >
            Save Ending
          </Button>
        </div>
      </Card>
    </div>
  );
};