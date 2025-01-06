import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface GroupSearchResultsProps {
  searchResults: any[];
  onJoinSuccess: (group: any) => void;
}

export const GroupSearchResults = ({ searchResults, onJoinSuccess }: GroupSearchResultsProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleJoinGroup = async (group: any) => {
    try {
      if (group.privacy === "public") {
        const { error } = await supabase
          .from("group_members")
          .insert({
            group_id: group.id,
            user_id: session?.user?.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "You have joined the group",
        });
        
        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["my-groups"] });
        queryClient.invalidateQueries({ queryKey: ["search-groups"] });
        
        // Navigate to the group chat
        onJoinSuccess(group);
      } else {
        // Send join request for private groups
        const { error } = await supabase
          .from("group_join_requests")
          .insert({
            group_id: group.id,
            user_id: session?.user?.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Join request sent",
        });
      }
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
    }
  };

  const handleLeaveGroup = async (group: any) => {
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", group.id)
        .eq("user_id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have left the group",
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["search-groups"] });
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
      {searchResults?.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No groups found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchResults?.map((group) => (
            <div
              key={group.id}
              className="bg-gray-50 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-medium text-gray-900 text-lg mb-2">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {group.description}
                </p>
              </div>
              <div className="flex justify-end">
                {group.is_member ? (
                  <Button
                    onClick={() => handleLeaveGroup(group)}
                    variant="outline"
                    className="border-red-200 hover:bg-red-50 text-red-600"
                  >
                    Leave Group
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleJoinGroup(group)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {group.privacy === "public" ? "Join Group" : "Request to Join"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};