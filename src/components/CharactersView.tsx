import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export const CharactersView = () => {
  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Characters</h1>
          <p className="text-gray-500">Create and manage your story characters</p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-600 gap-2">
          <Plus className="h-4 w-4" />
          Add Character
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        No characters created yet. Add your first character to get started!
      </div>
    </div>
  );
};