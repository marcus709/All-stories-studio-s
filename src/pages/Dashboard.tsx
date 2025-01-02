import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  LineChart, 
  GitBranch, 
  Lightbulb,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/Header";
import { StoriesDialog } from "@/components/StoriesDialog";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryProvider } from "@/contexts/StoryContext";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("stories");

  const renderView = () => {
    switch (selectedView) {
      case "stories":
        return <StoriesDialog />;
      case "characters":
        return <CharactersView />;
      case "plot":
        return <PlotDevelopmentView />;
      case "flow":
        return <StoryFlow />;
      case "ideas":
        return <StoryIdeasView />;
      default:
        return <StoriesDialog />;
    }
  };

  return (
    <StoryProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20">
          <div className="mb-6">
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stories">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Stories</span>
                  </div>
                </SelectItem>
                <SelectItem value="characters">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Characters</span>
                  </div>
                </SelectItem>
                <SelectItem value="plot">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4" />
                    <span>Plot Development</span>
                  </div>
                </SelectItem>
                <SelectItem value="flow">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    <span>Story Flow</span>
                  </div>
                </SelectItem>
                <SelectItem value="ideas">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Story Ideas</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderView()}
        </main>
      </div>
    </StoryProvider>
  );
};

export default Dashboard;