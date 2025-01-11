import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { StoryEnding } from "./StoryEnding";
import { MilestonesTimeline } from "./MilestonesTimeline";
import { CharacterArcs } from "./CharacterArcs";
import { ThemeManager } from "./ThemeManager";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const BackwardsStoryPlanningView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ending");

  const { data: storyEnding } = useQuery({
    queryKey: ["storyEnding", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return null;
      const { data, error } = await supabase
        .from("backwards_story_endings")
        .select("*")
        .eq("story_id", selectedStory.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        toast({
          title: "Error",
          description: "Failed to load story ending",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ending">Define Ending</TabsTrigger>
            <TabsTrigger value="milestones">Major Milestones</TabsTrigger>
            <TabsTrigger value="characters">Character Arcs</TabsTrigger>
            <TabsTrigger value="themes">Themes & Messages</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-12rem)] mt-6">
            <TabsContent value="ending" className="m-0">
              <StoryEnding initialData={storyEnding} />
            </TabsContent>

            <TabsContent value="milestones" className="m-0">
              <MilestonesTimeline />
            </TabsContent>

            <TabsContent value="characters" className="m-0">
              <CharacterArcs />
            </TabsContent>

            <TabsContent value="themes" className="m-0">
              <ThemeManager />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};