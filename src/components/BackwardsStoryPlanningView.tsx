import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Loader2, Plus, ArrowDown } from "lucide-react";
import { useToast } from "./ui/use-toast";

export const BackwardsStoryPlanningView = () => {
  const [newStep, setNewStep] = useState("");
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: planningSteps = [], isLoading } = useQuery({
    queryKey: ["planning-steps", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return [];
      
      const { data, error } = await supabase
        .from("story_planning_steps")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("step_number", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory,
  });

  const addStepMutation = useMutation({
    mutationFn: async (description: string) => {
      if (!selectedStory) throw new Error("No story selected");
      
      const { data, error } = await supabase
        .from("story_planning_steps")
        .insert({
          story_id: selectedStory.id,
          description,
          step_number: (planningSteps[0]?.step_number ?? 0) + 1,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planning-steps"] });
      setNewStep("");
      toast({
        title: "Success",
        description: "Planning step added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add planning step",
        variant: "destructive",
      });
      console.error("Error adding planning step:", error);
    },
  });

  const handleAddStep = () => {
    if (!newStep.trim()) {
      toast({
        title: "Error",
        description: "Please enter a step description",
        variant: "destructive",
      });
      return;
    }

    addStepMutation.mutate(newStep);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Backwards Story Planning</h1>
          <p className="text-gray-500">Plan your story from end to beginning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 h-[calc(100vh-12rem)] overflow-y-auto">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Planning Step</h2>
            <p className="text-gray-600">
              Start with your story's ending and work backwards. Each step should describe
              a key event or development that leads to the next.
            </p>
            <Textarea
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Describe what needs to happen..."
              className="min-h-[100px] resize-none"
            />
          </div>

          <Button
            onClick={handleAddStep}
            disabled={addStepMutation.isPending || !newStep.trim()}
            className="w-full bg-violet-500 hover:bg-violet-600"
          >
            {addStepMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Step...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Planning Step
              </>
            )}
          </Button>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {planningSteps.map((step, index) => (
              <Card key={step.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold">
                      {step.step_number}
                    </div>
                    {index < planningSteps.length - 1 && (
                      <div className="h-full w-0.5 bg-violet-100 my-2">
                        <ArrowDown className="text-violet-400 relative top-1/2" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 whitespace-pre-wrap">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};