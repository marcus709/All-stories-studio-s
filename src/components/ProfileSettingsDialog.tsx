import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "./profile/AvatarUpload";
import { ProfileForm } from "./profile/ProfileForm";
import { AtSign, Copy, Instagram, Link, Mail } from "lucide-react";
import { Json } from "@/integrations/supabase/types/database.types";

interface ProfileSettingsDialogProps {
  onClose?: () => void;
}

interface SocialLinks {
  website: string | null;
  twitter: string | null;
  instagram: string | null;
  newsletter: string | null;
}

export function ProfileSettingsDialog({ onClose }: ProfileSettingsDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({
    username: "",
    bio: "",
    avatar_url: "",
    background_url: "",
    title: "",
    location: "",
    available: false,
    social_links: {
      website: null,
      twitter: null,
      instagram: null,
      newsletter: null,
    } as SocialLinks,
  });

  React.useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session?.user?.id]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url, background_url, title, location, available, social_links")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: session?.user?.id,
            username: session?.user?.email?.split("@")[0] || "",
          });

        if (insertError) throw insertError;

        setProfile({
          username: session?.user?.email?.split("@")[0] || "",
          bio: "",
          avatar_url: "",
          background_url: "",
          title: "",
          location: "",
          available: false,
          social_links: {
            website: null,
            twitter: null,
            instagram: null,
            newsletter: null,
          },
        });
        return;
      }

      const socialLinks = (typeof data.social_links === 'object' && data.social_links !== null)
        ? data.social_links as unknown as SocialLinks
        : {
            website: null,
            twitter: null,
            instagram: null,
            newsletter: null,
          };

      setProfile({
        username: data.username || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
        background_url: data.background_url || "",
        title: data.title || "",
        location: data.location || "",
        available: data.available || false,
        social_links: socialLinks,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        username: profile.username,
        bio: profile.bio,
        title: profile.title,
        location: profile.location,
        available: profile.available,
        social_links: profile.social_links as unknown as Json,
        background_url: profile.background_url,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session?.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile settings have been saved.",
      });
      onClose?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleProfileChange = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyEmail = async () => {
    if (session?.user?.email) {
      await navigator.clipboard.writeText(session.user.email);
      toast({
        title: "Success",
        description: "Email copied to clipboard",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto bg-white">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mb-6">
            <AvatarUpload
              avatarUrl={profile.avatar_url}
              backgroundUrl={profile.background_url}
              onAvatarChange={(url) =>
                setProfile((prev) => ({ ...prev, avatar_url: url }))
              }
              onBackgroundChange={(url) =>
                setProfile((prev) => ({ ...prev, background_url: url }))
              }
            />
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                value={profile.username}
                onChange={(e) => handleProfileChange("username", e.target.value)}
                placeholder="Your name"
                className="text-2xl font-semibold text-center w-full bg-transparent border-none focus:outline-none"
              />
              
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleProfileChange("title", e.target.value)}
                placeholder="Your title"
                className="text-gray-500 text-center w-full bg-transparent border-none focus:outline-none"
              />

              <div className="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  checked={profile.available}
                  onChange={(e) => handleProfileChange("available", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-gray-600">Available for new opportunities</span>
              </div>

              <div className="flex justify-center gap-4 my-4">
                {profile.social_links.twitter && (
                  <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer">
                    <AtSign className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  </a>
                )}
                {profile.social_links.website && (
                  <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer">
                    <Link className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  </a>
                )}
                {profile.social_links.instagram && (
                  <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                  </a>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.location.href = `mailto:${session?.user?.email}`}
                >
                  <Mail className="h-4 w-4" />
                  Contact me
                </Button>
                <span className="text-gray-400 flex items-center">or</span>
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleCopyEmail}
                >
                  <Copy className="h-4 w-4" />
                  Copy email
                </Button>
              </div>

              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleProfileChange("location", e.target.value)}
                placeholder="Location (e.g., NYC, USA)"
                className="text-gray-500 text-center w-full bg-transparent border-none focus:outline-none"
              />

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-left">About</h3>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  placeholder="Tell us about yourself"
                  className="w-full min-h-[150px] p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose?.()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}