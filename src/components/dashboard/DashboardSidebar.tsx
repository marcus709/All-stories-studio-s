import { useState, useEffect } from "react";
import { Book, Users, LineChart, Lightbulb, FileText, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { StoriesDialog } from "../StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StoryButtons } from "../stories/StoryButtons";
import { Story } from "@/types/story";

const navigationItems = [
  { id: "story", icon: Book, label: "Story Editor" },
  { id: "characters", icon: Users, label: "Characters" },
  { id: "plot", icon: LineChart, label: "Plot Development" },
  { id: "ideas", icon: Lightbulb, label: "Story Ideas" },
  { id: "docs", icon: FileText, label: "Story Docs" },
  { id: "logic", icon: AlertTriangle, label: "Story Logic" },
] as const;

type View = (typeof navigationItems)[number]["id"];

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar = ({ currentView, setCurrentView, isCollapsed, onToggleCollapse }: DashboardSidebarProps) => {
  const [showStoriesDialog, setShowStoriesDialog] = useState(false);
  const { selectedStory, setSelectedStory } = useStory();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setProfile({
            id: data.id,
            username: data.username,
            avatar_url: data.avatar_url,
            bio: data.bio,
            website: null
          });
        }
      }
    };

    fetchProfile();
  }, []);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setShowStoriesDialog(false);
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-16 w-12 h-[calc(100vh-4rem)] border-r bg-white flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <nav className="space-y-3">
          {navigationItems.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              disabled={!selectedStory}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors
                ${currentView === id ? "text-purple-600 bg-purple-50" : "text-gray-700 hover:bg-gray-50"}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] border-r bg-white">
      <div className="flex flex-col h-full">
        <div className="absolute right-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-12 px-8 mt-8">
          <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-lg font-medium">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-gray-900">
              {profile?.username || "Loading..."}
            </h3>
          </div>
        </div>

        <div className="space-y-4 mb-6 px-8">
          <StoryButtons
            selectedStory={selectedStory}
            isLoading={false}
            onOpenStories={() => setShowStoriesDialog(true)}
            onNewStory={() => {
              setShowStoriesDialog(true);
              setSelectedStory(null);
            }}
            createMutationPending={false}
          />
          <StoriesDialog
            open={showStoriesDialog}
            onOpenChange={setShowStoriesDialog}
            onStorySelect={handleStorySelect}
          />
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-3 pr-4">
            {navigationItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                disabled={!selectedStory}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-colors text-gray-700 text-lg
                  ${currentView === id ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50"}`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}