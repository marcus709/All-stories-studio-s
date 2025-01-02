import { Book, Users, LineChart, GitBranch, Lightbulb } from "lucide-react";
import { StoriesDialog } from "../StoriesDialog";
import { useStory } from "@/contexts/StoryContext";

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

  return (
    <div className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] border-r bg-white">
      <div className="p-6 flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-medium">
            M
          </div>
          <div className="flex flex-col">
            <h3 className="font-medium text-lg text-gray-900">Marcus</h3>
            <p className="text-sm text-gray-500">Curious Plan</p>
          </div>
        </div>

        {/* Stories Section */}
        <div className="space-y-3 mb-8">
          <StoriesDialog />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-gray-700 text-lg
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