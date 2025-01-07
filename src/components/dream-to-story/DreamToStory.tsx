import { useState } from "react";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Save, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DreamToStory = () => {
  const [dream, setDream] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { selectedStory } = useStory();
  const { toast } = useToast();

  const handleGenerateStory = async () => {
    if (!dream.trim()) {
      toast({
        title: "Error",
        description: "Please enter your dream first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-dream-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setGeneratedStory(data.generatedStory);
      toast({
        title: "Success",
        description: "Your dream has been transformed into a story",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDocuments = async () => {
    if (!selectedStory) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("documents").insert({
        story_id: selectedStory.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: "Dream Story",
        content: generatedStory,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story saved to documents",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dream to Story</h1>
          <p className="text-gray-500">Transform your dreams into captivating stories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-[calc(100vh-12rem)] overflow-y-auto">
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Dream</h2>
            <Textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream in detail..."
              className="min-h-[300px] resize-none"
            />
          </div>

          <Button
            onClick={handleGenerateStory}
            disabled={isGenerating || !dream.trim()}
            className="w-full bg-violet-500 hover:bg-violet-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transforming Dream...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Transform into Story
              </>
            )}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Generated Story</h2>
          {generatedStory ? (
            <>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
                <div className="whitespace-pre-wrap font-sans text-sm">
                  {generatedStory}
                </div>
              </div>
              <Button
                onClick={handleSaveToDocuments}
                disabled={isSaving}
                variant="outline"
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save to Documents
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Your transformed story will appear here
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};