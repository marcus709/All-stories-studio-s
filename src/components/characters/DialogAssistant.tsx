import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Character } from "@/integrations/supabase/types/tables.types";

interface DialogAssistantProps {
  characters: Character[];
}

export function DialogAssistant({ characters }: DialogAssistantProps) {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [generatedDialog, setGeneratedDialog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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

    try {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          story_id: selectedStory.id,
          title: `Dialog: ${characters
            .filter(char => selectedCharacters.includes(char.id))
            .map(char => char.name)
            .join(" & ")}`,
          content: generatedDialog,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dialog saved to documents successfully",
      });
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save dialog to documents",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Characters</h2>
          <Select
            onValueChange={(value) => setSelectedCharacters(prev => 
              prev.includes(value) ? prev : [...prev, value]
            )}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a character" />
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
                <div key={charId} className="flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1">
                  <span>{character.name}</span>
                  <button
                    onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dialog Context</h2>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the situation or scene for this dialog..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleGenerateDialog}
          disabled={isGenerating || selectedCharacters.length < 2}
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isGenerating ? "Generating..." : "Generate Dialog"}
        </Button>
      </div>

      {generatedDialog && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="whitespace-pre-wrap font-sans">{generatedDialog}</pre>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveToDocument}
              variant="outline"
              className="gap-2"
            >
              Save to Documents
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}