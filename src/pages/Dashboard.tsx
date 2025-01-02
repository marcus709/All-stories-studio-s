import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Users, 
  LineChart, 
  GitFlow, 
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

export const Dashboard = () => {
  const [wordCount, setWordCount] = useState(1);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(e.target.value.trim() === "" ? 0 : words.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] border-r bg-white">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
              M
            </div>
            <div>
              <h3 className="font-medium">Marcus</h3>
              <p className="text-sm text-gray-500">Curious Plan</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-purple-600">
              <BookOpen className="h-5 w-5" />
              View All Stories
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-2">
              <span className="text-xl">+</span>
              Create New Story
            </Button>
          </div>

          <div className="mt-8 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BookOpen className="h-5 w-5" />
              Story Editor
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-5 w-5" />
              Characters
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LineChart className="h-5 w-5" />
              Plot Development
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <GitFlow className="h-5 w-5" />
              Story Flow
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Lightbulb className="h-5 w-5" />
              Story Ideas
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 pt-16 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Your Story</h1>
              <p className="text-gray-500">Let your creativity flow</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 mb-4">
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="config1">Configuration 1</SelectItem>
                  <SelectItem value="config2">Configuration 2</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select writing tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>

              <Button className="ml-auto bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500">
                <Wand2 className="mr-2 h-4 w-4" />
                Get AI Suggestions
              </Button>
            </div>

            <Textarea
              placeholder="Start writing your story here..."
              className="min-h-[400px] resize-none"
              onChange={handleTextChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;