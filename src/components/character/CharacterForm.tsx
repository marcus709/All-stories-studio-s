import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Wand2 } from "lucide-react";

interface CharacterFormProps {
  formData: {
    name: string;
    role: string;
    traits: string;
    goals: string;
    backstory: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function CharacterForm({
  formData,
  handleInputChange,
  isSubmitting,
  onCancel,
  onSubmit
}: CharacterFormProps) {
  return (
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          className="bg-purple-500 hover:bg-purple-600"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Character"}
        </Button>
      </div>
    </div>
  );
}