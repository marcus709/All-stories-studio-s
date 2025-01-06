import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface CreateStoryFormProps {
  newStory: { title: string; description: string };
  onClose: () => void;
  onChange: (field: "title" | "description", value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function CreateStoryForm({ newStory, onClose, onChange, onSubmit, isLoading }: CreateStoryFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          placeholder="Enter story title"
          value={newStory.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter story description"
          className="min-h-[120px]"
          value={newStory.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          className="bg-purple-500 hover:bg-purple-600"
          onClick={onSubmit}
          disabled={!newStory.title.trim() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Story"}
        </Button>
      </div>
    </div>
  );
}