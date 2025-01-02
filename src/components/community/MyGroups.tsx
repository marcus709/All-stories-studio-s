import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupSettingsDialog } from "./GroupSettingsDialog";
import { GroupCard } from "./GroupCard";
import { GroupChat } from "./GroupChat";
import { useToast } from "@/hooks/use-toast";

export const MyGroups = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState<any>(null);

  const { data: groups, isLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: async () => {
      const { data: memberGroups, error: memberError } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner (
            user_id,
            role
          )
        `)
        .eq("group_members.user_id", session?.user?.id);

      if (memberError) throw memberError;

      const { data: createdGroups, error: creatorError } = await supabase
        .from("groups")
        .select(`
          *,
          group_members (
            user_id,
            role
          )
        `)
        .eq("created_by", session?.user?.id);

      if (creatorError) throw creatorError;

      const allGroups = [...(memberGroups || []), ...(createdGroups || [])];
      const uniqueGroups = Array.from(new Map(allGroups.map(group => [group.id, group])).values());
      
      return uniqueGroups;
    },
    enabled: !!session?.user?.id,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", selectedGroup.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
      setIsDeleteOpen(false);
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
    mutationFn: async () => {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", selectedGroup.id)
        .eq("user_id", session?.user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast({
        title: "Success",
        description: "Left group successfully",
      });
      setIsLeaveOpen(false);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleGroupAction = (group: any, action: 'delete' | 'leave' | 'settings') => {
    setSelectedGroup(group);
    switch (action) {
      case 'delete':
        setIsDeleteOpen(true);
        break;
      case 'leave':
        setIsLeaveOpen(true);
        break;
      case 'settings':
        setIsSettingsOpen(true);
        break;
    }
  };

  const isGroupCreator = (group: any) => group.created_by === session?.user?.id;

  if (selectedChatGroup) {
    return (
      <GroupChat
        group={selectedChatGroup}
        onBack={() => setSelectedChatGroup(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Groups</h1>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsCreateOpen(true)}
        >
          + Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups?.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            isCreator={isGroupCreator(group)}
            onDelete={() => handleGroupAction(group, "delete")}
            onLeave={() => handleGroupAction(group, "leave")}
            onSettings={() => handleGroupAction(group, "settings")}
            onClick={() => setSelectedChatGroup(group)}
          />
        ))}
      </div>

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {selectedGroup && (
        <>
          <DeleteGroupDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => deleteGroupMutation.mutate()}
          />

          <LeaveGroupDialog
            isOpen={isLeaveOpen}
            onClose={() => setIsLeaveOpen(false)}
            onConfirm={() => leaveGroupMutation.mutate()}
          />

          <GroupSettingsDialog
            group={selectedGroup}
            isCreator={isGroupCreator(selectedGroup)}
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
        </>
      )}
    </div>
  );
};
