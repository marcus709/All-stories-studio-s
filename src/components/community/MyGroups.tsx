import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Trash2, Settings, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupSettingsDialog } from "./GroupSettingsDialog";
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

  const { data: groups, isLoading } = useQuery({
    queryKey: ["my-groups"],
    queryFn: async () => {
      // Query for groups where user is either creator or member
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

      // Combine and deduplicate groups
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
          <div
            key={group.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-medium text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">
                  {group.group_members?.length || 1} member{group.group_members?.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {isGroupCreator(group) ? (
                <Button variant="ghost" size="icon" onClick={() => handleGroupAction(group, 'delete')}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => handleGroupAction(group, 'leave')}>
                  <LogOut className="h-4 w-4 text-red-500" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleGroupAction(group, 'settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CreateGroupDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
      />

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