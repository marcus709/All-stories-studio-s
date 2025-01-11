import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Award, HelpCircle, Globe, Twitter, Instagram } from "lucide-react";
import { AchievementsDialog } from "./AchievementsDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  profile: {
    username: string;
    bio: string;
    genres?: string[];
    skills?: string[];
    social_links?: {
      website: string | null;
      twitter: string | null;
      instagram: string | null;
    };
  };
  onChange: (field: string, value: any) => void;
}

export function ProfileForm({ profile, onChange }: ProfileFormProps) {
  const session = useSession();
  const [showAchievements, setShowAchievements] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const { data: selectedAchievements, refetch: refetchSelected } = useQuery({
    queryKey: ["selectedAchievements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("selected_achievements")
        .select(`
          slot_number,
          achievement:achievements (
            id,
            name,
            description,
            icon
          )
        `)
        .eq("user_id", session?.user?.id)
        .order("slot_number");
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleAchievementSelect = async (achievement: any) => {
    if (!selectedSlot) return;

    const existingSelection = selectedAchievements?.find(
      (a) => a.slot_number === selectedSlot
    );

    if (existingSelection) {
      await supabase
        .from("selected_achievements")
        .update({
          achievement_id: achievement.id,
        })
        .eq("user_id", session?.user?.id)
        .eq("slot_number", selectedSlot);
    } else {
      await supabase.from("selected_achievements").insert({
        user_id: session?.user?.id,
        achievement_id: achievement.id,
        slot_number: selectedSlot,
      });
    }

    await refetchSelected();
    setShowAchievements(false);
    setSelectedSlot(null);
  };

  const handleAchievementClick = (slotNumber: number) => {
    setSelectedSlot(slotNumber);
    setShowAchievements(true);
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedSlot(null);
    setShowAchievements(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={profile.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="Enter your name"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Textarea
            value={profile.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            placeholder="Tell us about yourself"
            className="min-h-[100px] bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Writing Focus / Genres</label>
          <Input
            value={profile.genres?.join(", ") || ""}
            onChange={(e) => onChange("genres", e.target.value.split(",").map(s => s.trim()))}
            placeholder="Enter genres (comma-separated, e.g.: Fantasy, Sci-Fi)"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Skills</label>
          <Input
            value={profile.skills?.join(", ") || ""}
            onChange={(e) => onChange("skills", e.target.value.split(",").map(s => s.trim()))}
            placeholder="Enter skills (comma-separated, e.g.: Editing, World-building)"
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Social Links</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <Input
                value={profile.social_links?.website || ""}
                onChange={(e) =>
                  onChange("social_links", {
                    ...profile.social_links,
                    website: e.target.value,
                  })
                }
                placeholder="Your website"
                className="bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              <Input
                value={profile.social_links?.twitter || ""}
                onChange={(e) =>
                  onChange("social_links", {
                    ...profile.social_links,
                    twitter: e.target.value,
                  })
                }
                placeholder="Twitter profile"
                className="bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              <Input
                value={profile.social_links?.instagram || ""}
                onChange={(e) =>
                  onChange("social_links", {
                    ...profile.social_links,
                    instagram: e.target.value,
                  })
                }
                placeholder="Instagram profile"
                className="bg-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Achievements</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpClick}
              type="button"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              What are achievements?
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const achievement = selectedAchievements?.find(
                (a) => a.slot_number === index + 1
              )?.achievement;

              return (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  onClick={() => handleAchievementClick(index + 1)}
                >
                  {achievement ? (
                    <>
                      <Award className="w-6 h-6" />
                      <span className="text-xs">{achievement.name}</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Empty slot
                      </span>
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <AchievementsDialog
        isOpen={showAchievements}
        onClose={() => {
          setShowAchievements(false);
          setSelectedSlot(null);
        }}
        onSelect={selectedSlot ? handleAchievementSelect : undefined}
        selectedSlot={selectedSlot || undefined}
      />
    </>
  );
}