import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  LineChart, 
  GitBranch, 
  Lightbulb,
  Book,
  Plus,
  Wand
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { StoriesDialog } from "@/components/StoriesDialog";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryProvider, useStory } from "@/contexts/StoryContext";

type View = "story" | "characters" | "plot" | "flow" | "ideas";

function DashboardContent() {
  const [wordCount, setWordCount] = useState(1);
  const [currentView, setCurrentView] = useState<View>("story");
  const { selectedStory } = useStory();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(e.target.value.trim() === "" ? 0 : words.length);
  };

  const renderMainContent = () => {
    if (!selectedStory) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-gray-500">
          Please select or create a story to get started
        </div>
      );
    }

    switch (currentView) {
      case "characters":
        return <CharactersView />;
      case "plot":
        return <PlotDevelopmentView />;
      case "flow":
        return <StoryFlow />;
      case "ideas":
        return <StoryIdeasView />;
      case "story":
        return (
          <div className="max-w-5xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold">Your Story</h1>
                <p className="text-gray-500">Let your creativity flow</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {wordCount} words
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Readability: N/A
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <div className="flex gap-4 mb-6">
                <Select>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select Configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="config1">Configuration 1</SelectItem>
                    <SelectItem value="config2">Configuration 2</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select writing tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>

                <button className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center gap-2 transition-colors">
                  <Wand className="h-4 w-4" />
                  Get AI Suggestions
                </button>
              </div>

              <Textarea
                placeholder="Start writing your story here..."
                className="min-h-[500px] resize-none text-base p-4"
                onChange={handleTextChange}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            This feature is coming soon!
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Sidebar */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r bg-white">
        <div className="p-4 flex flex-col h-full">
          {/* Profile Section */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg font-medium">
              M
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-900">Marcus</h3>
              <p className="text-sm text-gray-500">Curious Plan</p>
            </div>
          </div>

          {/* Stories Section */}
          <div className="space-y-2 mb-8">
            <StoriesDialog />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <button 
              onClick={() => setCurrentView("story")}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700
                ${currentView === "story" ? "text-purple-600" : "hover:bg-gray-50"}`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Story Editor</span>
            </button>
            
            <button 
              onClick={() => setCurrentView("characters")}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700
                ${currentView === "characters" ? "text-purple-600" : "hover:bg-gray-50"}`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">Characters</span>
            </button>
            
            <button 
              onClick={() => setCurrentView("plot")}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700
                ${currentView === "plot" ? "text-purple-600" : "hover:bg-gray-50"}`}
            >
              <LineChart className="h-5 w-5" />
              <span className="font-medium">Plot Development</span>
            </button>
            
            <button 
              onClick={() => setCurrentView("flow")}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700
                ${currentView === "flow" ? "text-purple-600" : "hover:bg-gray-50"}`}
            >
              <GitBranch className="h-5 w-5" />
              <span className="font-medium">Story Flow</span>
            </button>
            
            <button 
              onClick={() => setCurrentView("ideas")}
              disabled={!selectedStory}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-700
                ${currentView === "ideas" ? "text-purple-600" : "hover:bg-gray-50"}`}
            >
              <Lightbulb className="h-5 w-5" />
              <span className="font-medium">Story Ideas</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16">
        {renderMainContent()}
      </div>
    </div>
  );
}

export const Dashboard = () => {
  return (
    <StoryProvider>
      <DashboardContent />
    </StoryProvider>
  );
};

export default Dashboard;
