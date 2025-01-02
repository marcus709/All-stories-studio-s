import { useState } from "react";
import { BookOpen, LineChart, Wand } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { useStory } from "@/contexts/StoryContext";

type View = "story" | "characters" | "plot" | "flow" | "ideas";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [wordCount, setWordCount] = useState(1);
  const { selectedStory } = useStory();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedStory) return;
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(e.target.value.trim() === "" ? 0 : words.length);
  };

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
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Story</h1>
              <p className="text-gray-500 text-lg">Let your creativity flow</p>
            </div>
            <div className="flex items-center gap-8 text-base text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {wordCount} words
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Readability: N/A
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm p-8 mt-6 relative ${!selectedStory ? 'opacity-50' : ''}`}>
            {!selectedStory && (
              <div className="absolute inset-0 bg-transparent z-10" />
            )}
            <div className="flex gap-6 mb-8">
              <Select disabled={!selectedStory}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="config1">Configuration 1</SelectItem>
                  <SelectItem value="config2">Configuration 2</SelectItem>
                </SelectContent>
              </Select>

              <Select disabled={!selectedStory}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select writing tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>

              <button 
                className={`ml-auto px-8 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center gap-2 transition-colors ${!selectedStory ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!selectedStory}
              >
                <Wand className="h-5 w-5" />
                Get AI Suggestions
              </button>
            </div>

            <Textarea
              placeholder={selectedStory ? "Start writing your story here..." : "Please select or create a story to start writing"}
              className="min-h-[600px] resize-none text-lg p-6"
              onChange={handleTextChange}
              disabled={!selectedStory}
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