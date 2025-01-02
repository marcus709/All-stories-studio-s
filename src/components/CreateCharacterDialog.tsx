import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { X, Wand2 } from "lucide-react";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCharacterDialog({ isOpen, onOpenChange }: CreateCharacterDialogProps) {
  const handleCreateCharacter = () => {
    // Here you would typically save the character to your backend
    console.log("Creating character");
    onOpenChange(false);
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
            <Input id="name" placeholder="Enter character name" />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Input id="role" placeholder="Enter character role" />
          </div>

          <div className="space-y-2">
            <label htmlFor="traits" className="text-sm font-medium">
              Traits (comma-separated)
            </label>
            <Input 
              id="traits" 
              placeholder="brave, loyal, intelligent"
              defaultValue="brave, loyal, intelligent"
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
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600"
              onClick={handleCreateCharacter}
            >
              Create Character
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}