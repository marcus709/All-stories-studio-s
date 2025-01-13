import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface GroupGoalsTabProps {
  groupId: string;
  isCreator: boolean;
}

export const GroupGoalsTab = ({ groupId, isCreator }: GroupGoalsTabProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [goalType, setGoalType] = useState<"word_count" | "time_based">("word_count");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [targetValue, setTargetValue] = useState("");

  const { data: goals } = useQuery({
    queryKey: ["group-goals", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_goals")
        .select(`
          *,
          group_goal_progress (
            value,
            date
          )
        `)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("group_goals")
        .insert({
          group_id: groupId,
          created_by: session.user.id,
          goal_type: goalType,
          frequency,
          target_value: parseInt(targetValue),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-goals"] });
      toast({
        title: "Success",
        description: "Group goal created successfully",
      });
      setTargetValue("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create group goal",
        variant: "destructive",
      });
      console.error("Error creating group goal:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetValue || parseInt(targetValue) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid target value",
        variant: "destructive",
      });
      return;
    }
    createGoalMutation.mutate();
  };

  const calculateProgress = (goal: any) => {
    if (!goal.group_goal_progress?.length) return 0;
    const totalProgress = goal.group_goal_progress.reduce((sum: number, progress: any) => sum + progress.value, 0);
    return Math.min((totalProgress / goal.target_value) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {isCreator && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select value={goalType} onValueChange={(value: "word_count" | "time_based") => setGoalType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select goal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="word_count">Word Count</SelectItem>
                <SelectItem value="time_based">Time Based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Select value={frequency} onValueChange={(value: "daily" | "weekly" | "monthly") => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={`Target ${goalType === "word_count" ? "words" : "minutes"}`}
              min="1"
            />
          </div>

          <Button type="submit" disabled={createGoalMutation.isPending}>
            Create Goal
          </Button>
        </form>
      )}

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500">Active Goals</h4>
        {goals?.map((goal) => (
          <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">
                {goal.target_value} {goal.goal_type === "word_count" ? "words" : "minutes"} ({goal.frequency})
              </h5>
              <span className="text-sm text-gray-500">
                {new Date(goal.created_at).toLocaleDateString()}
              </span>
            </div>
            <Progress value={calculateProgress(goal)} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
};