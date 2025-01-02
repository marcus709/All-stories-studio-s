import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CharacterForm } from "./character/CharacterForm";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCharacterDialog({ isOpen, onOpenChange }: CreateCharacterDialogProps) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    traits: "brave, loyal, intelligent",
    goals: "",
    backstory: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to check authentication status when dialog opens
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a character",
          variant: "destructive",
        });
        onOpenChange(false);
      }
    };

    if (isOpen) {
      checkSession();
    }
  }, [isOpen, toast, onOpenChange, supabase.auth]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateCharacter = async () => {
    // Double check session before submitting
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a character",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

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
      const { error } = await supabase.from("characters").insert({
        name: formData.name,
        role: formData.role,
        traits: formData.traits.split(",").map((trait) => trait.trim()),
        goals: formData.goals,
        backstory: formData.backstory,
        user_id: currentSession.user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Character created successfully",
      });

      setFormData({
        name: "",
        role: "",
        traits: "brave, loyal, intelligent",
        goals: "",
        backstory: ""
      });
      
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating character:", error);
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
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
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Create Character</DialogTitle>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Fill out the form below to create a new character.
          </DialogDescription>
        </DialogHeader>

        <CharacterForm
          formData={formData}
          handleInputChange={handleInputChange}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleCreateCharacter}
        />
      </DialogContent>
    </Dialog>
  );
}