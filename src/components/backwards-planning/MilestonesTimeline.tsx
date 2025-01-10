import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type MilestoneType = "major_event" | "character_decision" | "theme_setup" | "ending";

export const MilestonesTimeline = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    milestone_type: "major_event" as MilestoneType,
  });

  const { data: milestones } = useQuery({
    queryKey: ["milestones", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("backwards_planning_milestones")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("position");

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const addMilestoneMutation = useMutation({
    mutationFn: async (data: typeof newMilestone) => {
      if (!selectedStory?.id) return;

      const position = milestones ? milestones.length : 0;

      const { error } = await supabase
        .from("backwards_planning_milestones")
        .insert({
          story_id: selectedStory.id,
          position,
          title: data.title,
          description: data.description,
          milestone_type: data.milestone_type,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      setNewMilestone({
        title: "",
        description: "",
        milestone_type: "major_event",
      });
      toast({
        title: "Success",
        description: "Milestone added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add milestone",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Major Milestones</h2>

        <div className="space-y-4 mb-8">
          <Input
            placeholder="Milestone title"
            value={newMilestone.title}
            onChange={e => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <Textarea
            placeholder="Milestone description"
            value={newMilestone.description}
            onChange={e => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <Select
            value={newMilestone.milestone_type}
            onValueChange={value => setNewMilestone(prev => ({ ...prev, milestone_type: value as MilestoneType }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select milestone type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="major_event">Major Event</SelectItem>
              <SelectItem value="character_decision">Character Decision</SelectItem>
              <SelectItem value="theme_setup">Theme Setup</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={() => addMilestoneMutation.mutate(newMilestone)}
            disabled={addMilestoneMutation.isPending}
          >
            Add Milestone
          </Button>
        </div>

        <div className="space-y-4">
          {milestones?.map((milestone, index) => (
            <Card key={milestone.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {milestone.milestone_type.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Step {milestones.length - index}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};