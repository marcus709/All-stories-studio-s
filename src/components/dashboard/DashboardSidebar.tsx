import { Book, Users, LineChart, GitBranch, Lightbulb } from "lucide-react";
import { StoriesDialog } from "../StoriesDialog";
import { useStory } from "@/contexts/StoryContext";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const navigationItems = [
  { id: "story", icon: Book, label: "Story Editor" },
  { id: "characters", icon: Users, label: "Characters" },
  { id: "plot", icon: LineChart, label: "Plot Development" },
  { id: "flow", icon: GitBranch, label: "Story Flow" },
  { id: "ideas", icon: Lightbulb, label: "Story Ideas" },
] as const;

type View = (typeof navigationItems)[number]["id"];

interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export const DashboardSidebar = ({ currentView, setCurrentView }: DashboardSidebarProps) => {
  const { selectedStory } = useStory();
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] border-r bg-white">
      <div className="p-8 flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-12 px-2 mt-4">
          <div className="w-11 h-11 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg font-medium">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              profile?.username?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-gray-900">
              {profile?.username || "Anonymous"}
            </h3>
            <p className="text-xs text-gray-500">
              {profile?.bio || "No bio yet"}
            </p>
          </div>
        </div>

        {/* Stories Section */}
        <div className="space-y-4 mb-10">
          <StoriesDialog />
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
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
      </div>
    </div>
  );
};