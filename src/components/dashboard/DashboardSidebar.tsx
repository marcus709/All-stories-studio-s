import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProfileSettingsDialog } from "@/components/ProfileSettingsDialog";
import { Settings } from "lucide-react";

export const DashboardSidebar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;

      const profileData: Profile = {
        id: data.id,
        username: data.username,
        avatar_url: data.avatar_url,
        bio: data.bio,
        genres: data.genres || null,
        skills: data.skills || null,
        pinned_work: data.pinned_work || null,
        social_links: data.social_links || null
      };

      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = (profile: Profile) => {
    setProfile({
      id: profile.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      genres: profile.genres || null,
      skills: profile.skills || null,
      pinned_work: profile.pinned_work || null,
      social_links: profile.social_links || null
    });
  };

  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard")}
          >
            Overview
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard/stories")}
          >
            My Stories
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard/characters")}
          >
            Characters
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard/ideas")}
          >
            Story Ideas
          </Button>
        </nav>

        {showSettings && (
          <ProfileSettingsDialog onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  );
};