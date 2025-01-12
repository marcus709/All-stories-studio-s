import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AvatarUpload } from "./profile/AvatarUpload";
import { ProfileForm } from "./profile/ProfileForm";
import { CreditCard } from "lucide-react";
import { FriendsManagement } from "./profile/FriendsManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Json } from "@/integrations/supabase/types/database.types";

interface ProfileSettingsDialogProps {
  onClose?: () => void;
}

interface PinnedWork {
  title: string | null;
  content: string | null;
  link: string | null;
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
    genres: [] as string[],
    skills: [] as string[],
    pinned_work: {
      title: null,
      content: null,
      link: null,
    } as PinnedWork,
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
        .select("username, bio, avatar_url, background_url, genres, skills, pinned_work, social_links")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

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
          genres: [],
          skills: [],
          pinned_work: {
            title: null,
            content: null,
            link: null,
          },
          social_links: {
            website: null,
            twitter: null,
            instagram: null,
            newsletter: null,
          },
        });
        return;
      }

      const pinnedWork = (typeof data.pinned_work === 'object' && data.pinned_work !== null) 
        ? data.pinned_work as unknown as PinnedWork 
        : {
            title: null,
            content: null,
            link: null,
          };

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
        genres: data.genres || [],
        skills: data.skills || [],
        pinned_work: pinnedWork,
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
        genres: profile.genres,
        skills: profile.skills,
        pinned_work: profile.pinned_work as unknown as Json,
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

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management portal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-6">
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="text-lg py-3">Profile</TabsTrigger>
            <TabsTrigger value="friends" className="text-lg py-3">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="mb-12">
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

              <div className="space-y-6">
                <ProfileForm profile={profile} onChange={handleProfileChange} />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleManageSubscription}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose?.()}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="friends">
            <FriendsManagement />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}