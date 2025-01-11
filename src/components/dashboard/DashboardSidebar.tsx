import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types";
import { ProfileForm } from "../profile/ProfileForm";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { View } from "@/types/story";

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar = ({ 
  currentView, 
  setCurrentView,
  isCollapsed,
  onToggleCollapse 
}: DashboardSidebarProps) => {
  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;

      if (data) {
        const profileData: Profile = {
          id: data.id,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          genres: data.genres || [],
          skills: data.skills || [],
          pinned_work: {
            title: data.pinned_work?.title || "",
            content: data.pinned_work?.content || "",
            link: data.pinned_work?.link || "",
          },
          social_links: {
            website: data.social_links?.website || "",
            twitter: data.social_links?.twitter || "",
            instagram: data.social_links?.instagram || "",
            newsletter: data.social_links?.newsletter || "",
          },
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      const profileData = {
        ...data,
        pinned_work: {
          title: data.pinned_work?.title || "",
          content: data.pinned_work?.content || "",
          link: data.pinned_work?.link || "",
        },
        social_links: {
          website: data.social_links?.website || "",
          twitter: data.social_links?.twitter || "",
          instagram: data.social_links?.instagram || "",
          newsletter: data.social_links?.newsletter || "",
        },
      };

      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", session?.user?.id);

      if (error) throw error;

      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn(
      "relative flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-background"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && <h2 className="text-lg font-semibold">Dashboard</h2>}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            <div className="space-y-1">
              <Button
                variant={currentView === "stories" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("stories")}
              >
                {isCollapsed ? "📚" : "Stories"}
              </Button>
              <Button
                variant={currentView === "characters" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("characters")}
              >
                {isCollapsed ? "👤" : "Characters"}
              </Button>
              <Button
                variant={currentView === "documents" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("documents")}
              >
                {isCollapsed ? "📄" : "Documents"}
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      {!isCollapsed && profile && (
        <div className="mt-auto border-t p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <ProfileForm profile={profile} onChange={handleProfileUpdate} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};