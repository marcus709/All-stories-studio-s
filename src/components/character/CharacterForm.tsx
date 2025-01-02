import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Wand2 } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { useStory } from "@/contexts/StoryContext";

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
  const { generateContent, isLoading } = useAI();
  const { selectedStory } = useStory();
  const [aiSuggestions, setAiSuggestions] = useState("");

  const handleGetSuggestions = async (type: 'traits' | 'goals') => {
    const context = {
      storyDescription: selectedStory?.description || '',
      traits: formData.traits,
    };

    const prompt = type === 'traits' 
      ? `Generate character traits for a character named ${formData.name} with the role of ${formData.role}`
      : `Generate goals and motivations for a character named ${formData.name} who is ${formData.traits}`;

    const suggestions = await generateContent(prompt, type, context);
    if (suggestions) {
      setAiSuggestions(suggestions);
    }
  };

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
          onClick={() => handleGetSuggestions('traits')}
          disabled={isLoading}
        >
          <Wand2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
        <Button 
          variant="link" 
          className="p-0 h-auto text-purple-500 hover:text-purple-600 flex items-center gap-2"
          onClick={() => handleGetSuggestions('goals')}
          disabled={isLoading}
        >
          <Wand2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Get Goal Suggestions
        </Button>
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

      {(isLoading || aiSuggestions) && (
        <div className="bg-purple-50 rounded-lg p-6 relative">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">AI Suggestions</h3>
          {isLoading ? (
            <div className="flex items-center gap-2 text-purple-600">
              <Wand2 className="h-5 w-5 animate-spin" />
              <span>Getting AI suggestions...</span>
            </div>
          ) : (
            <div className="prose prose-purple max-w-none">
              {aiSuggestions.split('\n').map((paragraph, index) => (
                <p key={index} className="text-purple-800">{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      )}

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