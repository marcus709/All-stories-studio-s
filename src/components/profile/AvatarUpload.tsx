import React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string;
  backgroundUrl?: string;
  onAvatarChange: (url: string) => void;
  onBackgroundChange?: (url: string) => void;
}

export function AvatarUpload({ 
  avatarUrl, 
  backgroundUrl, 
  onAvatarChange,
  onBackgroundChange 
}: AvatarUploadProps) {
  const session = useSession();
  const { toast } = useToast();

  async function handleFileUpload(file: File, isBackground: boolean = false) {
    try {
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
        .update({ 
          [isBackground ? 'background_url' : 'avatar_url']: urlData.publicUrl 
        })
        .eq("id", session?.user?.id);

      if (updateError) throw updateError;

      if (isBackground && onBackgroundChange) {
        onBackgroundChange(urlData.publicUrl);
      } else {
        onAvatarChange(urlData.publicUrl);
      }

      toast({
        title: "Success",
        description: `Your ${isBackground ? 'background' : 'profile'} picture has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error uploading your ${isBackground ? 'background' : 'profile'} picture. Please try again.`,
        variant: "destructive",
      });
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    await handleFileUpload(e.target.files[0], false);
  }

  async function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    await handleFileUpload(e.target.files[0], true);
  }

  return (
    <div>
      <div className="relative w-full">
        {/* Background Image Container */}
        <div className="relative h-64 w-full bg-gray-50 overflow-hidden rounded-xl">
          {backgroundUrl ? (
            <img
              src={backgroundUrl}
              alt="Profile Background"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}
          <label
            htmlFor="background-upload"
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
          >
            <Upload className="h-6 w-6 text-white" />
            <span className="mt-1 text-sm text-white">Change Background</span>
          </label>
          <input
            id="background-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBackgroundUpload}
          />
        </div>

        {/* Profile Picture Container */}
        <div className="absolute left-8 -bottom-16">
          <div className="relative h-32 w-32 rounded-full bg-white p-1 shadow-lg">
            <div className="relative h-full w-full rounded-full bg-gray-100 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl text-gray-400 font-semibold">
                  {session?.user?.email?.[0].toUpperCase() || "?"}
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100"
              >
                <Upload className="h-6 w-6 text-white" />
                <span className="mt-1 text-xs text-white">Change Photo</span>
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
      </div>
    </div>
  );
}