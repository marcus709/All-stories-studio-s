import { Character } from "@/types/character";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CharacterForm } from "@/components/character/CharacterForm";

interface CharacterPreviewProps {
  character: Character;
  isInMessage?: boolean;
}

export const CharacterPreview = ({ character, isInMessage }: CharacterPreviewProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-300 cursor-pointer ${
          isInMessage ? 'max-w-sm' : 'w-full'
        }`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <UserRound className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {character.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {character.role || "No role specified"}
            </p>
            {character.traits && character.traits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {character.traits.slice(0, 2).map((trait, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <CharacterForm
            formData={character}
            isReadOnly={true}
            onCancel={() => setShowDetails(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};