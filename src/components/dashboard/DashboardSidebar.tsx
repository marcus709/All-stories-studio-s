import { useState, useEffect } from "react";
import { Home, Book, Users, LineChart, Lightbulb, FileText, AlertTriangle, Rewind, ChevronLeft, ChevronRight } from "lucide-react";
import { StoriesDialog } from "../StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types/tables.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StoryButtons } from "../stories/StoryButtons";
import { Story } from "@/types/story";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type View = "home" | "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

const navigationItems = [
  { id: "home" as View, icon: Home, label: "Home" },
  { id: "story" as View, icon: Book, label: "Brainstorm" },
  { id: "characters" as View, icon: Users, label: "Characters" },
  { id: "plot" as View, icon: LineChart, label: "Formatting" },
  { id: "dream" as View, icon: Rewind, label: "Plot Development" },
  { id: "ideas" as View, icon: Lightbulb, label: "World Builder" },
  { id: "docs" as View, icon: FileText, label: "Story Docs" },
  { id: "logic" as View, icon: AlertTriangle, label: "Story Logic" },
] as const;

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
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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

  useEffect(() => {
    // Get user's location
    fetch('https://api.ipapi.com/api/check?access_key=YOUR_API_KEY')
      .then(response => response.json())
      .then(data => {
        setCurrentLocation(`${data.city}, ${data.country_name}`);
      })
      .catch(() => {
        // Fallback to Riga, Latvia if location fetch fails
        setCurrentLocation("Riga, Latvia");
      });

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setShowStoriesDialog(false);
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-16 w-16 h-[calc(100vh-4rem)] bg-background/60 backdrop-blur-xl border-r border-border/40 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] flex flex-col items-center py-4 rounded-r-2xl">
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
                "w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative",
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
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-background/60 backdrop-blur-xl border-r border-border/40 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-r-2xl">
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
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium relative",
                  currentView === id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-border/50">
          <div className="bg-accent/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">
              {format(currentDate, "M/d/yyyy")}
            </div>
            <div className="text-xs text-muted-foreground/70">
              {currentLocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};