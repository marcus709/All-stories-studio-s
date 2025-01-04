import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Award, Trophy, Star, Medal, BookmarkCheck, Check, ThumbsUp } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition_type: string;
  condition_value: number;
}

interface AchievementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (achievement: Achievement) => void;
  selectedSlot?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  "📚": <BookmarkCheck className="w-6 h-6" />,
  "✍️": <Check className="w-6 h-6" />,
  "⭐": <Star className="w-6 h-6" />,
  "🌟": <Trophy className="w-6 h-6" />,
  "💭": <Award className="w-6 h-6" />,
  "🗣️": <Medal className="w-6 h-6" />,
  "🤝": <ThumbsUp className="w-6 h-6" />,
};

export function AchievementsDialog({ isOpen, onClose, onSelect, selectedSlot }: AchievementsDialogProps) {
  const session = useSession();

  const { data: unlockedAchievements } = useQuery({
    queryKey: ["unlockedAchievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_achievements")
        .select(`
          achievement:achievements (
            id,
            name,
            description,
            icon,
            condition_type,
            condition_value
          )
        `)
        .eq("user_id", session?.user?.id);
      return data?.map(item => item.achievement) as Achievement[] || [];
    },
    enabled: !!session?.user?.id,
  });

  const { data: allAchievements } = useQuery({
    queryKey: ["allAchievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("achievements")
        .select("*");
      return data as Achievement[] || [];
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedSlot ? `Select Achievement for Slot ${selectedSlot}` : 'Achievements'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {selectedSlot 
              ? "Click on an achievement to display it in the selected slot."
              : "Achievements are special badges you can earn by participating in the community. Complete different actions to unlock more achievements and showcase them on your profile!"
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            {allAchievements?.map((achievement) => {
              const isUnlocked = unlockedAchievements?.some(ua => ua.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-4 border rounded-lg transition-colors",
                    isUnlocked ? (
                      onSelect 
                        ? "cursor-pointer hover:border-primary hover:bg-accent/50" 
                        : "border-primary/50"
                    ) : (
                      "opacity-50 border-dashed"
                    )
                  )}
                  onClick={() => isUnlocked && onSelect?.(achievement)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      isUnlocked ? "bg-primary/10" : "bg-muted"
                    )}>
                      {iconMap[achievement.icon] || <Award className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {!isUnlocked && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Complete {achievement.condition_value} {achievement.condition_type.replace(/_/g, ' ')} to unlock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}