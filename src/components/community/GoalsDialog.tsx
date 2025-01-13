import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface GoalsDialogProps {
  onOpenChange: (open: boolean) => void;
}

interface GoalProgress {
  goal_type: 'word_count' | 'time_based';
  frequency: 'daily' | 'weekly' | 'monthly';
  target_value: number;
  current_progress: number;
}

export function GoalsDialog({ onOpenChange }: GoalsDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [goalType, setGoalType] = useState<'word_count' | 'time_based'>('word_count');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [targetValue, setTargetValue] = useState('');

  // Fetch user's goals and progress
  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: userGoals, error } = await supabase
        .from('user_goals')
        .select(`
          *,
          goal_progress(value)
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      return userGoals.map(goal => {
        const totalProgress = goal.goal_progress?.reduce((sum: number, p: any) => sum + p.value, 0) || 0;
        return {
          ...goal,
          current_progress: totalProgress
        };
      });
    },
    enabled: !!session?.user?.id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id || !targetValue) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .insert({
          user_id: session.user.id,
          goal_type: goalType,
          frequency: frequency,
          target_value: parseInt(targetValue),
        });

      if (error) throw error;

      toast({
        title: "Goal created!",
        description: "Your writing goal has been set successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Writing Goals
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="set">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="set">Set Goal</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="set">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Goal Type</Label>
                  <RadioGroup
                    value={goalType}
                    onValueChange={(value: 'word_count' | 'time_based') => setGoalType(value)}
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="word_count" id="word_count" />
                      <Label htmlFor="word_count">Word Count</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="time_based" id="time_based" />
                      <Label htmlFor="time_based">Time-Based</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Frequency</Label>
                  <RadioGroup
                    value={frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly">Monthly</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>
                    Target {goalType === 'word_count' ? 'Words' : 'Minutes'}
                  </Label>
                  <Input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder={`Enter target ${goalType === 'word_count' ? 'words' : 'minutes'}`}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Set Goal</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading goals...</p>
              ) : goals && goals.length > 0 ? (
                goals.map((goal: any) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {goal.goal_type === 'word_count' ? <Target className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        <span className="font-medium">
                          {goal.frequency.charAt(0).toUpperCase() + goal.frequency.slice(1)} Goal
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {goal.current_progress} / {goal.target_value} {goal.goal_type === 'word_count' ? 'words' : 'minutes'}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current_progress / goal.target_value) * 100} 
                      className="h-2"
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No goals set yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}