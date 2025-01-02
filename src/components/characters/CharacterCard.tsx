import { UserRound, Calendar, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Character } from "@/integrations/supabase/types/tables.types";

interface CharacterCardProps {
  character: Character;
  onDeleteClick: (id: string) => void;
}

export const CharacterCard = ({ character, onDeleteClick }: CharacterCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDeleteClick(character.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
      </Button>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
          <UserRound className="w-8 h-8 text-purple-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{character.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
            {character.role || "No role specified"}
          </p>
          <div className="flex flex-wrap gap-2">
            {character.traits?.map((trait, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>
            Created {formatDistanceToNow(new Date(character.created_at || ''), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>
            Updated {formatDistanceToNow(new Date(character.updated_at || ''), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};