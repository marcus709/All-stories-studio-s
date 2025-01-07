import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Character } from "@/integrations/supabase/types/tables.types";
import { DialogForm } from "./dialog-assistant/DialogForm";
import { DialogPreview } from "./dialog-assistant/DialogPreview";

interface DialogAssistantProps {
  characters: Character[];
}

export function DialogAssistant({ characters }: DialogAssistantProps) {
  const [generatedDialog, setGeneratedDialog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { generateContent } = useAI();
  const { toast } = useToast();
  const { selectedStory } = useStory();

  const handleGenerateDialog = async (selectedCharacters: string[], context: string) => {
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
        .map(char => char.name)
        .join(" & ");

      const uniqueTitle = `Dialog: ${characterNames} - ${timestamp}`;

      const { error: insertError } = await supabase
        .from("documents")
        .insert({
          story_id: selectedStory.id,
          title: uniqueTitle,
          content: generatedDialog,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (insertError) {
        // Check if it's a unique constraint violation
        if (insertError.code === '23505') {
          toast({
            title: "Warning",
            description: "This exact dialog content already exists in another document",
            variant: "destructive",
          });
        } else {
          throw insertError;
        }
      } else {
        toast({
          title: "Success",
          description: "Dialog saved as a new document",
        });

        // Reset the form after successful save
        setGeneratedDialog("");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <Card className="p-6">
        <DialogForm
          characters={characters}
          isGenerating={isGenerating}
          onGenerate={handleGenerateDialog}
        />
      </Card>

      <Card className="p-6">
        <DialogPreview
          generatedDialog={generatedDialog}
          isSaving={isSaving}
          onSave={handleSaveToDocument}
        />
      </Card>
    </div>
  );
}