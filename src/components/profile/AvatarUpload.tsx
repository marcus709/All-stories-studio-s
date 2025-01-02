import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
}

export function AvatarUpload({ avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const session = useSession();
  const { toast } = useToast();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", session?.user?.id);

      if (updateError) throw updateError;

      onAvatarChange(urlData.publicUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error uploading avatar",
        description: "There was an error uploading your avatar. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Profile Picture</label>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full bg-gray-100">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
          >
            <span className="text-sm text-white">Change Photo</span>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>
    </div>
  );
}