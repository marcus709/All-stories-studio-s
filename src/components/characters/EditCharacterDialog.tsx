import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Character } from "@/integrations/supabase/types/tables.types";
import { CharacterForm } from "../character/CharacterForm";

interface EditCharacterDialogProps {
  character: Character;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCharacterDialog({ character, isOpen, onOpenChange }: EditCharacterDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: character.name,
    role: character.role || "",
    traits: character.traits?.join(", ") || "",
    goals: character.goals || "",
    backstory: character.backstory || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateCharacter = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Character name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("characters")
        .update({
          name: formData.name,
          role: formData.role,
          traits: formData.traits.split(",").map((trait) => trait.trim()),
          goals: formData.goals,
          backstory: formData.backstory,
        })
        .eq("id", character.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Character updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["characters"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating character:", error);
      toast({
        title: "Error",
        description: "Failed to update character. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Character</DialogTitle>
        </DialogHeader>

        <CharacterForm
          formData={formData}
          handleInputChange={handleInputChange}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleUpdateCharacter}
        />
      </DialogContent>
    </Dialog>
  );
}