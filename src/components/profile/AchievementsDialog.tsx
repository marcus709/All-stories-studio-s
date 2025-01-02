import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Award, Trophy, Star, Medal, BookmarkCheck, Check, ThumbsUp } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Achievements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Achievements are special badges you can earn by participating in the community.
            Complete different actions to unlock more achievements and showcase them on your profile!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements?.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors
                  ${onSelect ? "hover:bg-accent" : ""}`}
                onClick={() => onSelect?.(achievement)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {iconMap[achievement.icon] || <Award className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}