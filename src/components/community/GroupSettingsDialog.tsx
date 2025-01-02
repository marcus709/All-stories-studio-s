import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GroupSettingsDialogProps {
  group: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
  };
  isCreator: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GroupSettingsDialog = ({
  group,
  isCreator,
  open,
  onOpenChange,
}: GroupSettingsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  const [imageUrl, setImageUrl] = useState<string | null>(group.image_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const updateGroupMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("groups")
        .update({ name, description, image_url: imageUrl })
        .eq("id", group.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-groups"] });
      toast({
        title: "Success",
        description: "Group settings updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update group settings",
        variant: "destructive",
      });
      console.error("Error updating group:", error);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setIsUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${group.id}-${Math.random()}.${fileExt}`;

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
        description: "Error uploading image",
        variant: "destructive",
      });
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isCreator ? "Edit" : "View"} Group Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {imageUrl ? (
                  <AvatarImage src={imageUrl} alt="Group" />
                ) : (
                  <AvatarFallback>GP</AvatarFallback>
                )}
                {isCreator && (
                  <label
                    htmlFor="group-image"
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                  >
                    <Upload className="h-6 w-6 text-white" />
                    <span className="mt-1 text-xs text-white">Upload Image</span>
                  </label>
                )}
                {isCreator && (
                  <input
                    id="group-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                )}
              </Avatar>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group Name"
              disabled={!isCreator}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group Description"
              className="min-h-[100px]"
              disabled={!isCreator}
            />
          </div>

          {isCreator && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => updateGroupMutation.mutate()}
                disabled={updateGroupMutation.isPending || isUploading}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};