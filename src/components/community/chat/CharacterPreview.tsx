import { Character } from "@/integrations/supabase/types/tables.types";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
        <DialogContent className="sm:max-w-lg">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <UserRound className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {character.name}
                </h2>
                <p className="text-gray-500">{character.role}</p>
              </div>
            </div>

            {character.traits && character.traits.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {character.goals && (
              <div>
                <h3 className="text-sm font-medium mb-2">Goals</h3>
                <p className="text-sm text-gray-600">{character.goals}</p>
              </div>
            )}

            {character.backstory && (
              <div>
                <h3 className="text-sm font-medium mb-2">Backstory</h3>
                <p className="text-sm text-gray-600">{character.backstory}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};