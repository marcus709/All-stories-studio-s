import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Character } from "@/integrations/supabase/types/tables.types";
import { Loader2 } from "lucide-react";

interface DialogFormProps {
  characters: Character[];
  isGenerating: boolean;
  onGenerate: (selectedCharacters: string[], context: string) => void;
}

export function DialogForm({ characters, isGenerating, onGenerate }: DialogFormProps) {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [context, setContext] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Character Selection</h2>
      <Select
        onValueChange={(value) => setSelectedCharacters(prev => 
          prev.includes(value) ? prev : [...prev, value]
        )}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select characters for the dialog" />
        </SelectTrigger>
        <SelectContent>
          {characters.map((character) => (
            <SelectItem key={character.id} value={character.id}>
              {character.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {selectedCharacters.map((charId) => {
          const character = characters.find(c => c.id === charId);
          return character ? (
            <div key={charId} className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 rounded-full px-3 py-1">
              <span className="text-sm font-medium">{character.name}</span>
              <button
                onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                className="text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100"
              >
                ×
              </button>
            </div>
          ) : null;
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dialog Context</h2>
        <Textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Set the scene or describe the situation for this dialog..."
          className="min-h-[150px] resize-none"
        />
      </div>

      <Button
        onClick={() => onGenerate(selectedCharacters, context)}
        disabled={isGenerating || selectedCharacters.length < 2}
        className="w-full bg-purple-500 hover:bg-purple-600"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Dialog...
          </>
        ) : (
          "Generate Dialog"
        )}
      </Button>
    </div>
  );
}