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

interface ProfileSettingsDialogProps {
  onClose?: () => void;
}

export function ProfileSettingsDialog({ onClose }: ProfileSettingsDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({
    username: "",
    bio: "",
    avatar_url: "",
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
        .select("username, bio, avatar_url")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // If no profile exists, we'll create one
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
        });
        return;
      }

      setProfile({
        username: data.username || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
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
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session?.user?.id,
          username: profile.username,
          bio: profile.bio,
        });

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

  const handleProfileChange = (field: string, value: string) => {
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
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Profile Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
                <AvatarUpload
                  avatarUrl={profile.avatar_url}
                  onAvatarChange={(url) =>
                    setProfile((prev) => ({ ...prev, avatar_url: url }))
                  }
                />
              </div>

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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose?.()}
                  className="px-3 py-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="px-3 py-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                >
                  Save Changes
                </Button>
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