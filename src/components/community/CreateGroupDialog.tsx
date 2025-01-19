import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InviteMembersInput } from "./InviteMembersInput";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateGroupDialog = ({ open, onOpenChange }: CreateGroupDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [groupType, setGroupType] = useState<"social" | "writing">("social");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  const [step, setStep] = useState<"details" | "invite">("details");

  // Effect to enforce private status for writing groups
  useEffect(() => {
    if (groupType === "writing") {
      setPrivacy("private");
      toast({
        title: "Writing Group Info",
        description: "Writing groups are limited to 6 members and are always private to protect shared content.",
      });
    }
  }, [groupType]);

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Not authenticated");
      
      // Create the group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name,
          description,
          created_by: session.user.id,
          privacy,
          image_url: imageUrl,
          group_type: groupType,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // If it's a writing group, create a shared story
      if (groupType === "writing") {
        const { error: storyError } = await supabase
          .from("stories")
          .insert({
            title: `${name} - Shared Story`,
            description: `Shared story space for the group ${name}`,
            user_id: session.user.id,
            is_shared_space: true,
            shared_group_id: group.id,
          });

        if (storyError) throw storyError;
      }

      // Add creator as admin
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          user_id: session.user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      setCreatedGroupId(group.id);
      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      setStep("invite");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating group:", error);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setIsUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("group-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("group-images")
        .getPublicUrl(filePath);

      setImageUrl(urlData.publicUrl);
      toast({
        title: "Success",
        description: "Group image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading image. Please try again.",
        variant: "destructive",
      });
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGroupMutation.mutate();
  };

  const handleFinish = () => {
    onOpenChange(false);
    setStep("details");
    setName("");
    setDescription("");
    setPrivacy("public");
    setGroupType("social");
    setImageUrl(null);
    setCreatedGroupId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "details" ? "Create New Group" : "Invite Members"}
          </DialogTitle>
          {step === "invite" && (
            <DialogDescription>
              Invite members to your new group
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "details" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imageUrl ? (
                    <AvatarImage src={imageUrl} alt="Group" />
                  ) : (
                    <AvatarFallback>GP</AvatarFallback>
                  )}
                  <label
                    htmlFor="group-image"
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                  >
                    <Upload className="h-6 w-6 text-white" />
                    <span className="mt-1 text-xs text-white">Upload Image</span>
                  </label>
                  <input
                    id="group-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </Avatar>
              </div>
            </div>
            
            <div className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group Name"
                required
              />
            </div>

            <div className="space-y-2">
              <Select value={groupType} onValueChange={(value: "social" | "writing") => setGroupType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Group</SelectItem>
                  <SelectItem value="writing">Shared Writing Group</SelectItem>
                </SelectContent>
              </Select>
              {groupType === "writing" && (
                <p className="text-sm text-gray-500">
                  A shared story space will be created for all group members to collaborate.
                  Writing groups are always private to protect shared content.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Select 
                value={privacy} 
                onValueChange={(value: "public" | "private") => setPrivacy(value)}
                disabled={groupType === "writing"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group Description"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!name.trim() || createGroupMutation.isPending || isUploading}
              >
                Create Group
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {createdGroupId && (
              <InviteMembersInput groupId={createdGroupId} />
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleFinish}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
