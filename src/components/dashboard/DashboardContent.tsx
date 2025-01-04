import { useState } from "react";
import { BookOpen, LineChart, Wand, Settings, Trash2, Edit } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { useStory } from "@/contexts/StoryContext";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIConfigurationDialog } from "@/components/ai/AIConfigurationDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type View = "story" | "characters" | "plot" | "flow" | "ideas";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [wordCount, setWordCount] = useState(1);
  const [storyContent, setStoryContent] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [configToEdit, setConfigToEdit] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string>("");
  const { selectedStory } = useStory();
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: aiConfigs = [] } = useQuery({
    queryKey: ['aiConfigurations'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_configurations')
        .select('*')
        .order('created_at', { ascending: true });
      return data || [];
    },
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedStory) return;
    const content = e.target.value;
    setStoryContent(content);
    const words = content.trim().split(/\s+/);
    setWordCount(content.trim() === "" ? 0 : words.length);
  };

  const handleGetSuggestions = async () => {
    if (!storyContent) {
      toast({
        title: "No content",
        description: "Please write some content first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    const selectedAIConfig = aiConfigs.find(config => config.id === selectedConfig);

    const { data: characters } = await supabase
      .from("characters")
      .select("name, role, traits")
      .eq("story_id", selectedStory?.id);

    const characterContext = characters?.map(char => 
      `${char.name} (${char.role}): ${Array.isArray(char.traits) ? char.traits.join(', ') : char.traits}`
    ).join('\n');

    const context = {
      storyDescription: selectedStory?.description || '',
      characters: characterContext,
      aiConfig: selectedAIConfig,
    };

    const suggestions = await generateContent(storyContent, "suggestions", context);
    if (suggestions) {
      setAiSuggestions(suggestions);
    }
  };

  const handleDeleteConfig = async () => {
    if (!configToDelete) return;

    try {
      await supabase
        .from('ai_configurations')
        .delete()
        .eq('id', configToDelete);

      toast({
        title: "Success",
        description: "AI configuration deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['aiConfigurations'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete AI configuration.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setConfigToDelete("");
    }
  };

  const handleConfigurationSelect = (value: string) => {
    if (value === "new") {
      setConfigToEdit(null);
      setIsConfigDialogOpen(true);
      return;
    }
    setSelectedConfig(value);
  };

  const handleNewConfigClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfigToEdit(null);
    setIsConfigDialogOpen(true);
  };

  const handleConfigEdit = (e: React.MouseEvent, config: any) => {
    e.preventDefault();
    e.stopPropagation();
    setConfigToEdit(config);
    setIsConfigDialogOpen(true);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
              <Select
                value={selectedConfig}
                onValueChange={handleConfigurationSelect}
                disabled={!selectedStory}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select AI Configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Configurations</SelectLabel>
                    {aiConfigs.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{config.name}</span>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger 
                              onClick={handleSettingsClick}
                              className="ml-2 focus:outline-none"
                            >
                              <Settings className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={(e) => handleConfigEdit(e, config)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setConfigToDelete(config.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value="new" onClick={handleNewConfigClick}>
                      <span className="text-blue-600">+ Configure New AI</span>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <button 
                className={`ml-auto px-8 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center gap-2 transition-colors ${!selectedStory || isLoading || !selectedConfig ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={handleGetSuggestions}
                disabled={!selectedStory || isLoading || !selectedConfig}
              >
                <Wand className="h-5 w-5" />
                {isLoading ? "Getting suggestions..." : "Get AI Suggestions"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Textarea
                placeholder={selectedStory ? "Start writing your story here..." : "Please select or create a story to start writing"}
                className="min-h-[400px] resize-none text-lg p-6"
                onChange={handleTextChange}
                value={storyContent}
                disabled={!selectedStory}
              />

              {(isLoading || aiSuggestions) && (
                <div className="bg-purple-50 rounded-lg p-6 relative">
                  <h3 className="text-xl font-semibold text-purple-900 mb-4">AI Suggestions</h3>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Wand className="h-5 w-5 animate-spin" />
                      <span>Getting AI suggestions...</span>
                    </div>
                  ) : (
                    <div className="prose prose-purple max-w-none">
                      {aiSuggestions.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-purple-800">{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <AIConfigurationDialog
            isOpen={isConfigDialogOpen}
            onClose={() => {
              setIsConfigDialogOpen(false);
              setConfigToEdit(null);
            }}
            configToEdit={configToEdit}
            onConfigSaved={() => {
              queryClient.invalidateQueries({ queryKey: ['aiConfigurations'] });
            }}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete AI Configuration</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this AI configuration? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfig} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
