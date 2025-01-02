import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { CreateCharacterDialog } from "./CreateCharacterDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CharacterCard } from "./characters/CharacterCard";
import { DeleteCharacterDialog } from "./characters/DeleteCharacterDialog";

export const CharactersView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: characters, isLoading } = useQuery({
    queryKey: ["characters", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleDeleteCharacter = async (characterId: string) => {
    try {
      const { error } = await supabase
        .from("characters")
        .delete()
        .eq("id", characterId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Character deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["characters"] });
    } catch (error) {
      console.error("Error deleting character:", error);
      toast({
        title: "Error",
        description: "Failed to delete character. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCharacterToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Characters</h1>
          <p className="text-gray-500">Create and manage your story characters</p>
        </div>
        <Button 
          className="bg-purple-500 hover:bg-purple-600 gap-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add Character
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
        </div>
      ) : characters && characters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDeleteClick={(id) => setCharacterToDelete(id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[400px] text-gray-500">
          No characters created yet. Add your first character to get started!
        </div>
      )}

      <CreateCharacterDialog 
        isOpen={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <DeleteCharacterDialog
        isOpen={!!characterToDelete}
        onClose={() => setCharacterToDelete(null)}
        onConfirm={() => characterToDelete && handleDeleteCharacter(characterToDelete)}
      />
    </div>
  );
};