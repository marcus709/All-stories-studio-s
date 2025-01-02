import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

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
        title: "Success",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error uploading your avatar. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Profile Picture</label>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full bg-gray-100">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          )}
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
          >
            <Upload className="h-6 w-6 text-white" />
            <span className="mt-1 text-sm text-white">Change Photo</span>
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