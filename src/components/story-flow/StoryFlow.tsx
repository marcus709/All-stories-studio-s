import React, { useState } from "react";
import { StoryFlowTimeline } from "./StoryFlowTimeline";
import { CharacterRelationshipMap } from "./CharacterRelationshipMap";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolbarButtons } from "./components/ToolbarButtons";

export const StoryFlow = () => {
  const [activeView, setActiveView] = useState<"timeline" | "relationships">("timeline");
  const [isGenerating, setIsGenerating] = useState(false);
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleGetSuggestions = async () => {
    if (!selectedStory) {
      toast({
        title: "No story selected",
        description: "Please select a story first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-story-flow-suggestions', {
        body: { 
          storyId: selectedStory.id,
          type: activeView
        },
      });

      if (error) throw error;

      if (activeView === 'timeline') {
        // Add suggested plot events
        for (const suggestion of data.suggestions) {
          await supabase
            .from('plot_events')
            .insert({
              story_id: selectedStory.id,
              title: suggestion.title,
              description: suggestion.description,
              stage: suggestion.stage,
              user_id: (await supabase.auth.getUser()).data.user?.id,
              order_index: 0,
            });
        }
        queryClient.invalidateQueries({ queryKey: ['plotEvents', selectedStory.id] });
      } else {
        // Add suggested relationships
        for (const suggestion of data.suggestions) {
          await supabase
            .from('character_relationships')
            .insert({
              story_id: selectedStory.id,
              character1_id: suggestion.character1,
              character2_id: suggestion.character2,
              relationship_type: suggestion.relationshipType,
              description: suggestion.description,
            });
        }
        queryClient.invalidateQueries({ queryKey: ['relationships', selectedStory.id] });
      }

      toast({
        title: "Success",
        description: `Generated new ${activeView === 'timeline' ? 'plot events' : 'character relationships'} suggestions!`,
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Flow</h1>
          <p className="text-gray-600">Visualize your story's timeline and character interactions</p>
        </div>
      </div>

      <ToolbarButtons
        activeView={activeView}
        onViewChange={setActiveView}
        onGetSuggestions={handleGetSuggestions}
        isGenerating={isGenerating}
        selectedStory={selectedStory}
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeView === "timeline" ? (
          <div className="relative">
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
              <div className="bg-white text-xs font-medium text-center py-1 px-2 rounded border">
                More views coming soon!
              </div>
            </div>
            
            <div className="h-[600px] relative">
              <StoryFlowTimeline />
            </div>
          </div>
        ) : (
          <CharacterRelationshipMap />
        )}
      </div>
    </div>
  );
};
