import { Button } from "../ui/button";
import { Wand2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TextSuggestionsMenuProps {
  onSuggestionSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export const TextSuggestionsMenu = ({ 
  onSuggestionSelect,
  disabled 
}: TextSuggestionsMenuProps) => {
  const suggestions = [
    "Continue the story...",
    "Add more description",
    "Make it more dramatic",
    "Add dialogue",
    "Describe the setting",
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Get Suggestions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {suggestions.map((suggestion) => (
          <DropdownMenuItem
            key={suggestion}
            onClick={() => onSuggestionSelect(suggestion)}
          >
            {suggestion}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};