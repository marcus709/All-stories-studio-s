import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Character } from "@/integrations/supabase/types/tables.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface AddCharacterToMapDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCharacter: (character: Character) => void;
  characters: Character[];
  existingCharacters: Character[];
}

export const AddCharacterToMapDialog = ({
  isOpen,
  onClose,
  onAddCharacter,
  characters,
  existingCharacters,
}: AddCharacterToMapDialogProps) => {
  const { toast } = useToast();
  const availableCharacters = characters.filter(
    (char) => !existingCharacters.find((existing) => existing.id === char.id)
  );

  const handleAddCharacter = (character: Character) => {
    onAddCharacter(character);
    toast({
      title: "Character Added",
      description: `${character.name} has been added to the map.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Character to Map</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {availableCharacters.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No more characters available to add
            </div>
          ) : (
            <div className="space-y-2">
              {availableCharacters.map((character) => (
                <Button
                  key={character.id}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => handleAddCharacter(character)}
                >
                  {character.name}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};