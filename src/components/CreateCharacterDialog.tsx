import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X, Wand2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCharacterDialog({ isOpen, onOpenChange }: CreateCharacterDialogProps) {
  const session = useSession();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateCharacter = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a character",
        variant: "destructive",
      });
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
        user_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Character created successfully",
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        role: "",
        traits: "brave, loyal, intelligent",
        goals: "",
        backstory: ""
      });
      
      // Invalidate the characters query to refresh the list
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
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input 
              id="name" 
              placeholder="Enter character name" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Input 
              id="role" 
              placeholder="Enter character role" 
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="traits" className="text-sm font-medium">
              Traits (comma-separated)
            </label>
            <Input 
              id="traits" 
              placeholder="brave, loyal, intelligent"
              value={formData.traits}
              onChange={handleInputChange}
            />
            <Button 
              variant="link" 
              className="p-0 h-auto text-purple-500 hover:text-purple-600 flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Get AI Suggestions
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="goals" className="text-sm font-medium">
              Goals
            </label>
            <Textarea
              id="goals"
              placeholder="Enter character goals"
              className="min-h-[80px]"
              value={formData.goals}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="backstory" className="text-sm font-medium">
              Backstory
            </label>
            <Textarea
              id="backstory"
              placeholder="Enter character backstory"
              className="min-h-[120px]"
              value={formData.backstory}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleCreateCharacter}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Character"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}