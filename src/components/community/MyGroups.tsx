import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupSettingsDialog } from "./GroupSettingsDialog";
import { GroupCard } from "./GroupCard";
import { GroupChat } from "./GroupChat";
import { useGroups } from "@/hooks/useGroups";
import { useGroupMutations } from "@/hooks/useGroupMutations";

export const MyGroups = () => {
  const session = useSession();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedChatGroup, setSelectedChatGroup] = useState<any>(null);

  const { data: groups, isLoading } = useGroups();

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedGroup(null);
    if (selectedChatGroup?.id === selectedGroup?.id) {
      setSelectedChatGroup(null);
    }
  };

  const { deleteGroupMutation, leaveGroupMutation } = useGroupMutations(
    handleDeleteSuccess
  );

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Loading...</div>;
  }

  const handleGroupAction = (
    group: any,
    action: "delete" | "leave" | "settings"
  ) => {
    setSelectedGroup(group);
    switch (action) {
      case "delete":
        setIsDeleteOpen(true);
        break;
      case "leave":
        setIsLeaveOpen(true);
        break;
      case "settings":
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
        <h1 className="text-2xl font-semibold text-gray-900">My Groups</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
        >
          + Create Group
        </Button>
      </div>

      {groups?.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No groups yet. Create or join a group to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      )}

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {selectedGroup && (
        <>
          <DeleteGroupDialog
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => deleteGroupMutation.mutate(selectedGroup.id)}
          />

          <LeaveGroupDialog
            isOpen={isLeaveOpen}
            onClose={() => setIsLeaveOpen(false)}
            onConfirm={() => leaveGroupMutation.mutate(selectedGroup.id)}
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