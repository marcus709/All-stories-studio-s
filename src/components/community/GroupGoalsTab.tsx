import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";

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
            date,
            user_id,
            profiles:profiles (
              username,
              avatar_url
            )
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

  const calculateProgress = (goal: any, userId?: string) => {
    if (!goal.group_goal_progress?.length) return 0;
    const relevantProgress = userId
      ? goal.group_goal_progress.filter((p: any) => p.user_id === userId)
      : goal.group_goal_progress;
    const totalProgress = relevantProgress.reduce((sum: number, progress: any) => sum + progress.value, 0);
    return Math.min((totalProgress / goal.target_value) * 100, 100);
  };

  const groupProgressByUser = (goal: any) => {
    const userProgress = new Map();
    
    goal.group_goal_progress?.forEach((progress: any) => {
      if (!userProgress.has(progress.user_id)) {
        userProgress.set(progress.user_id, {
          username: progress.profiles?.username || "Unknown User",
          avatar_url: progress.profiles?.avatar_url,
          progress: 0,
        });
      }
      const current = userProgress.get(progress.user_id);
      current.progress += progress.value;
      userProgress.set(progress.user_id, current);
    });

    return Array.from(userProgress.entries()).map(([userId, data]) => ({
      userId,
      ...data,
    }));
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
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium text-gray-500">Active Goals</h4>
          <span className="text-xs text-gray-400">Member Progress →</span>
        </div>
        
        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4 space-y-4">
            {goals?.map((goal) => (
              <div key={goal.id} className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">
                      {goal.target_value} {goal.goal_type === "word_count" ? "words" : "minutes"} ({goal.frequency})
                    </h5>
                    <span className="text-sm text-gray-500">
                      {new Date(goal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Progress value={calculateProgress(goal)} className="h-2" />
                  
                  <div className="pt-2 space-y-2">
                    {groupProgressByUser(goal).map((userProgress) => (
                      <div key={userProgress.userId} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 w-1/3">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm truncate">{userProgress.username}</span>
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={(userProgress.progress / goal.target_value) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};