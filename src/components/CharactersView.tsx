import { Plus, UserRound, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { CreateCharacterDialog } from "./CreateCharacterDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const CharactersView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const session = useSession();

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
            <div
              key={character.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
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
    </div>
  );
};