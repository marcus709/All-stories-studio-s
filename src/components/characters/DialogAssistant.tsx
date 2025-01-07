import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Character } from "@/integrations/supabase/types/tables.types";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DialogAssistantProps {
  characters: Character[];
}

export function DialogAssistant({ characters }: DialogAssistantProps) {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [generatedDialog, setGeneratedDialog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { generateContent } = useAI();
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const handleGenerateDialog = async () => {
    if (selectedCharacters.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least two characters for the dialog",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const selectedCharacterDetails = characters
        .filter(char => selectedCharacters.includes(char.id))
        .map(char => ({
          name: char.name,
          traits: char.traits,
          role: char.role,
          goals: char.goals
        }));

      const prompt = `Create a dialog between the following characters:
        ${selectedCharacterDetails.map(char => 
          `${char.name} (${char.role}): ${char.traits?.join(", ")}`
        ).join("\n")}
        
        Context: ${context}
        
        Please write a natural, engaging dialogue that reflects each character's personality and goals.`;

      const dialog = await generateContent(prompt, 'suggestions', {
        storyDescription: selectedStory?.description || '',
        characters: JSON.stringify(selectedCharacterDetails)
      });

      if (dialog) {
        setGeneratedDialog(dialog);
      }
    } catch (error) {
      console.error("Error generating dialog:", error);
      toast({
        title: "Error",
        description: "Failed to generate dialog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToDocument = async () => {
    if (!selectedStory || !generatedDialog) return;

    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const characterNames = characters
        .filter(char => selectedCharacters.includes(char.id))
        .map(char => char.name)
        .join(" & ");

      // Create a unique document title with more specific identifier
      const uniqueTitle = `Dialog: ${characterNames} - ${timestamp}`;

      // First, check if a document with this exact content already exists
      const { data: existingDocs, error: checkError } = await supabase
        .from("documents")
        .select("id")
        .eq("story_id", selectedStory.id)
        .eq("content", generatedDialog);

      if (checkError) throw checkError;

      // Only proceed if no duplicate content is found
      if (!existingDocs || existingDocs.length === 0) {
        // Create a new document with unique content
        const { error: insertError } = await supabase
          .from("documents")
          .insert({
            story_id: selectedStory.id,
            title: uniqueTitle,
            content: generatedDialog,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          });

        if (insertError) throw insertError;

        toast({
          title: "Success",
          description: "Dialog saved as a new document",
        });

        // Reset the form after successful save
        setGeneratedDialog("");
        setContext("");
        setSelectedCharacters([]);
      } else {
        toast({
          title: "Warning",
          description: "This dialog content already exists in another document",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save dialog to documents",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ... keep existing code (JSX rendering part remains unchanged)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Character Selection</h2>
          <Select
            onValueChange={(value) => setSelectedCharacters(prev => 
              prev.includes(value) ? prev : [...prev, value]
            )}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select characters for the dialog" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((character) => (
                <SelectItem key={character.id} value={character.id}>
                  {character.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            {selectedCharacters.map((charId) => {
              const character = characters.find(c => c.id === charId);
              return character ? (
                <div key={charId} className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-3 py-1">
                  <span className="text-sm font-medium">{character.name}</span>
                  <button
                    onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                    className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Dialog Context</h2>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Set the scene or describe the situation for this dialog..."
            className="min-h-[150px] resize-none"
          />
        </div>

        <Button
          onClick={handleGenerateDialog}
          disabled={isGenerating || selectedCharacters.length < 2}
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Dialog...
            </>
          ) : (
            "Generate Dialog"
          )}
        </Button>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Generated Dialog</h2>
        {generatedDialog ? (
          <>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-sm">{generatedDialog}</pre>
            </div>
            <Button
              onClick={handleSaveToDocument}
              disabled={isSaving}
              variant="outline"
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving to Documents...
                </>
              ) : (
                "Save as New Document"
              )}
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            Generated dialog will appear here
          </div>
        )}
      </Card>
    </div>
  );
}
