import { useState } from "react";
import { BookOpen, LineChart, Wand, Settings, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useStory } from "@/contexts/StoryContext";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIConfigurationDialog } from "@/components/ai/AIConfigurationDialog";
import { calculateReadability } from "@/utils/readability";
import { useFeatureAccess } from "@/utils/subscriptionUtils";
import { PaywallAlert } from "@/components/PaywallAlert";
import { useSession } from "@supabase/auth-helpers-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { cn } from "@/lib/utils";

export const StoryView = () => {
  const [wordCount, setWordCount] = useState(1);
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [storyContent, setStoryContent] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [configToEdit, setConfigToEdit] = useState<any>(null);
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const { selectedStory } = useStory();
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const { currentLimits, getRequiredPlan } = useFeatureAccess();

  // Fetch AI configurations for the current user
  const { data: aiConfigurations = [] } = useQuery({
    queryKey: ["aiConfigurations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch AI configurations",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleContentChange = (content: string) => {
    if (!selectedStory) return;
    setStoryContent(content);
    const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/);
    setWordCount(content.trim() === "" ? 0 : words.length);
    setReadabilityScore(calculateReadability(content));
  };

  const handleGetSuggestions = async () => {
    if (!storyContent && !isChatMode) {
      toast({
        title: "No content",
        description: "Please write some content first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    if (currentLimits.ai_prompts === 0) {
      setShowPaywallAlert(true);
      return;
    }

    const selectedAIConfig = selectedConfig ? await supabase
      .from("ai_configurations")
      .select("*")
      .eq("id", selectedConfig)
      .single() : null;

    const context = {
      storyDescription: selectedStory?.description || "",
      aiConfig: selectedAIConfig?.data,
    };

    const contentToAnalyze = isChatMode ? messages[messages.length - 1]?.content : storyContent;
    const suggestions = await generateContent(contentToAnalyze, "suggestions", context);
    
    if (suggestions) {
      if (isChatMode) {
        setMessages([...messages, { role: 'assistant', content: suggestions }]);
      } else {
        setAiSuggestions(suggestions);
      }
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === "new") {
      setIsConfigDialogOpen(true);
    } else {
      setSelectedConfig(value);
    }
  };

  const handleChatSubmit = async (content: string) => {
    if (!content.trim()) return;
    
    const newMessages = [...messages, { role: 'user' as const, content }];
    setMessages(newMessages);
    
    // Trigger AI response
    const selectedAIConfig = selectedConfig ? await supabase
      .from("ai_configurations")
      .select("*")
      .eq("id", selectedConfig)
      .single() : null;

    const context = {
      storyDescription: selectedStory?.description || "",
      aiConfig: selectedAIConfig?.data,
    };

    const response = await generateContent(content, "suggestions", context);
    if (response) {
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Story</h1>
          <p className="text-gray-500 text-lg">Let your creativity flow</p>
        </div>
        <div className="flex items-center gap-8 text-base text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={isChatMode}
                onCheckedChange={setIsChatMode}
                className="data-[state=checked]:bg-purple-500"
              />
              <MessageSquare className="h-5 w-5" />
              Chat Mode
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {wordCount} words
            </div>
            {!isChatMode && (
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Readability: {readabilityScore}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`bg-white rounded-xl shadow-sm p-8 mt-6 relative ${!selectedStory ? "opacity-50" : ""}`}>
        {!selectedStory && (
          <div className="absolute inset-0 bg-transparent z-10" />
        )}
        
        {!isChatMode && (
          <div className="flex gap-6 mb-8 relative z-30">
            <Select
              value={selectedConfig}
              onValueChange={handleSelectChange}
              disabled={!selectedStory}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select AI Configuration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Configurations</SelectLabel>
                  {aiConfigurations?.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value="new">
                    <span className="text-blue-600">+ Configure New AI</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              className={`ml-auto px-8 py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center gap-2 transition-colors ${!selectedStory || isLoading || !selectedConfig ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handleGetSuggestions}
              disabled={!selectedStory || isLoading || !selectedConfig}
            >
              <Wand className="h-5 w-5" />
              {isLoading ? "Getting suggestions..." : "Get AI Suggestions"}
            </Button>
          </div>
        )}

        {isChatMode ? (
          <div className="flex flex-col h-[calc(100vh-300px)] max-h-[700px]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-6 py-3 backdrop-blur-sm shadow-sm",
                      message.role === "user"
                        ? "bg-purple-500/90 text-white ml-auto"
                        : "bg-gray-100/90 text-gray-900 border border-gray-200/50"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 sticky bottom-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100">
              <input
                type="text"
                placeholder="Share your ideas or ask for writing suggestions..."
                className="flex-1 rounded-full px-6 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChatSubmit(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector('input');
                  if (input) {
                    handleChatSubmit(input.value);
                    input.value = '';
                  }
                }}
                className="rounded-full bg-purple-500 hover:bg-purple-600 text-white px-6"
              >
                <Wand className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <RichTextEditor
              content={storyContent}
              onChange={handleContentChange}
              className="min-h-[400px]"
            />

            {(isLoading || aiSuggestions) && (
              <div className="bg-purple-50 rounded-lg p-6 relative mt-6">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">AI Suggestions</h3>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-purple-600">
                    <Wand className="h-5 w-5 animate-spin" />
                    <span>Getting AI suggestions...</span>
                  </div>
                ) : (
                  <div className="prose prose-purple max-w-none">
                    {aiSuggestions.split("\n").map((paragraph, index) => (
                      <p key={index} className="text-purple-800">{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AIConfigurationDialog
        isOpen={isConfigDialogOpen}
        onClose={() => {
          setIsConfigDialogOpen(false);
          setConfigToEdit(null);
        }}
        configToEdit={configToEdit}
        onConfigSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["aiConfigurations"] });
        }}
      />

      <PaywallAlert
        isOpen={showPaywallAlert}
        onClose={() => setShowPaywallAlert(false)}
        feature="AI writing suggestions"
        requiredPlan={getRequiredPlan("ai_prompts") || "creator"}
      />
    </div>
  );
};