import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Target } from "lucide-react";

interface GoalsDialogProps {
  onOpenChange: (open: boolean) => void;
}

export function GoalsDialog({ onOpenChange }: GoalsDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [goalType, setGoalType] = useState<'word_count' | 'time_based'>('word_count');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [targetValue, setTargetValue] = useState('');

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
            Set Writing Goal
          </DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}