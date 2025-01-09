import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { CharacterForm } from "./character/CharacterForm";
import { useStory } from "@/contexts/StoryContext";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCharacterDialog({ isOpen, onOpenChange }: CreateCharacterDialogProps) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { selectedStory } = useStory();
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    traits: "brave, loyal, intelligent",
    goals: "",
    backstory: "",
    psychology: {
      emotional_tendencies: [],
      fears: [],
      coping_mechanisms: [],
      mental_health: null
    },
    psychological_traits: {
      emotional_intelligence: 50,
      impulsiveness: 50,
      trust: 50,
      resilience: 50
    },
    values_and_morals: {
      loyalty: 50,
      honesty: 50,
      risk_taking: 50,
      alignment: {
        lawful_chaotic: 0,
        selfless_selfish: 0
      }
    },
    cultural_background: {
      traditions: [],
      taboos: [],
      religious_beliefs: []
    },
    life_events: {
      formative: [],
      turning_points: [],
      losses: []
    },
    ancestry: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a character",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  }, [isOpen, session, toast, onOpenChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreateCharacter = async () => {
    if (!session?.user?.id || !selectedStory?.id) {
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
      const { error } = await supabase
        .from("characters")
        .insert({
          name: formData.name,
          role: formData.role,
          traits: formData.traits.split(",").map((trait) => trait.trim()),
          goals: formData.goals,
          backstory: formData.backstory,
          psychology: formData.psychology,
          psychological_traits: formData.psychological_traits,
          values_and_morals: formData.values_and_morals,
          cultural_background: formData.cultural_background,
          life_events: formData.life_events,
          ancestry: formData.ancestry,
          user_id: session.user.id,
          story_id: selectedStory.id
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
        backstory: "",
        psychology: {
          emotional_tendencies: [],
          fears: [],
          coping_mechanisms: [],
          mental_health: null
        },
        psychological_traits: {
          emotional_intelligence: 50,
          impulsiveness: 50,
          trust: 50,
          resilience: 50
        },
        values_and_morals: {
          loyalty: 50,
          honesty: 50,
          risk_taking: 50,
          alignment: {
            lawful_chaotic: 0,
            selfless_selfish: 0
          }
        },
        cultural_background: {
          traditions: [],
          taboos: [],
          religious_beliefs: []
        },
        life_events: {
          formative: [],
          turning_points: [],
          losses: []
        },
        ancestry: ""
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
      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Character</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new character. Use the tabs to access advanced character details.
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