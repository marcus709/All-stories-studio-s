import { useState } from "react";
import { 
  BookOpen, 
  Users, 
  LineChart, 
  GitBranch, 
  Lightbulb,
  Wand2
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

export const Dashboard = () => {
  const [wordCount, setWordCount] = useState(1);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(e.target.value.trim() === "" ? 0 : words.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Sidebar */}
      <div className="fixed left-0 top-16 w-72 h-[calc(100vh-4rem)] border-r bg-white">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-lg">
              M
            </div>
            <div>
              <h3 className="font-medium">Marcus</h3>
              <p className="text-sm text-gray-500">Curious Plan</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <button className="w-full flex items-center gap-3 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">View All Stories</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xl">+</span>
              <span>Create New Story</span>
            </button>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <BookOpen className="h-5 w-5" />
              <span>Story Editor</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <Users className="h-5 w-5" />
              <span>Characters</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <LineChart className="h-5 w-5" />
              <span>Plot Development</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <GitBranch className="h-5 w-5" />
              <span>Story Flow</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
              <Lightbulb className="h-5 w-5" />
              <span>Story Ideas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 pt-16">
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
                <Wand2 className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default Dashboard;