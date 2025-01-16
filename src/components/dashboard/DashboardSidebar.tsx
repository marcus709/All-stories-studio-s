import { useState, useEffect } from "react";
import { Book, Users, LineChart, Lightbulb, FileText, AlertTriangle, Rewind, ChevronLeft, ChevronRight, Home, Bookmark, LayersIcon, Twitter } from "lucide-react";
import { StoriesDialog } from "../StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StoryButtons } from "../stories/StoryButtons";
import { Story } from "@/types/story";
import { cn } from "@/lib/utils";

const navigationItems = [
  { id: "story", icon: Home, label: "Home" },
  { id: "characters", icon: Users, label: "Characters" },
  { id: "plot", icon: LineChart, label: "Formatting" },
  { id: "dream", icon: Rewind, label: "Plot Development" },
  { id: "ideas", icon: Lightbulb, label: "Story Ideas" },
  { id: "docs", icon: FileText, label: "Story Docs" },
  { id: "logic", icon: AlertTriangle, label: "Story Logic" },
] as const;

const resourceItems = [
  { id: "bookmarks", icon: Bookmark, label: "Bookmarks" },
  { id: "stack", icon: LayersIcon, label: "Stack" },
  { id: "twitter", icon: Twitter, label: "Twitter" },
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
          setProfile(data);
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
      <div className="fixed left-0 top-16 w-16 h-[calc(100vh-4rem)] bg-background/80 backdrop-blur-xl border-r border-border/50 flex flex-col items-center py-4">
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
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
                currentView === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-background/80 backdrop-blur-xl border-r border-border/50">
      <div className="flex flex-col h-full">
        <div className="absolute right-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 px-4 pt-6 pb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg font-medium">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-foreground">
              {profile?.username || "Loading..."}
            </h3>
            <p className="text-sm text-muted-foreground">Writer</p>
          </div>
        </div>

        {/* Stories Section */}
        <div className="space-y-4 px-4 mb-6">
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

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {navigationItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                disabled={!selectedStory}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  currentView === id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}

            {/* Resources Section */}
            <div className="pt-6 pb-2">
              <h4 className="px-4 text-xs font-medium text-muted-foreground mb-2">RESOURCES</h4>
              {resourceItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium text-muted-foreground hover:bg-accent"
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-border/50">
          <div className="bg-accent/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">9/11/2024</div>
            <div className="text-xs text-muted-foreground/70">Riga, Latvia</div>
          </div>
        </div>
      </div>
    </div>
  );
}