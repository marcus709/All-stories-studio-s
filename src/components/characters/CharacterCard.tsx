import { UserRound, Calendar, Clock, Trash2, Share2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Character } from "@/integrations/supabase/types/tables.types";
import { useState } from "react";
import { ShareCharacterDialog } from "./ShareCharacterDialog";
import { EditCharacterDialog } from "./EditCharacterDialog";

interface CharacterCardProps {
  character: Character;
  onDeleteClick: (id: string) => void;
}

export const CharacterCard = ({ character, onDeleteClick }: CharacterCardProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg shadow-purple-100/50 p-6 hover:shadow-purple-200/50 transition-all duration-300 relative group transform hover:scale-[1.02]">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple-50 hover:text-purple-600"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit className="h-4 w-4 text-purple-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-purple-50 hover:text-purple-600"
          onClick={() => setShowShareDialog(true)}
        >
          <Share2 className="h-4 w-4 text-purple-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-50 hover:text-red-600"
          onClick={() => onDeleteClick(character.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <UserRound className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{character.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
            {character.role || "No role specified"}
          </p>
          <div className="flex flex-wrap gap-2">
            {character.traits?.map((trait, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>
            Created {formatDistanceToNow(new Date(character.created_at || ''), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>
            Updated {formatDistanceToNow(new Date(character.updated_at || ''), { addSuffix: true })}
          </span>
        </div>
      </div>

      <ShareCharacterDialog
        character={character}
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
      />

      <EditCharacterDialog
        character={character}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};