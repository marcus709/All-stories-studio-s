import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGroupMutations = (onSuccess?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      // First delete all group members
      const { error: membersError } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId);

      if (membersError) throw membersError;

      // Then delete all group messages
      const { error: messagesError } = await supabase
        .from("group_messages")
        .delete()
        .eq("group_id", groupId);

      if (messagesError) throw messagesError;

      // Finally delete the group itself
      const { error: groupError } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);

      if (groupError) throw groupError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
      console.error("Error deleting group:", error);
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", supabase.auth.getUser());

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast({
        title: "Success",
        description: "Left group successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
      console.error("Error leaving group:", error);
    },
  });

  return {
    deleteGroupMutation,
    leaveGroupMutation,
  };
};