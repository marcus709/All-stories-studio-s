import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/integrations/supabase/types";

export const Header = () => {
  const session = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;

      if (data) {
        // Ensure the data matches the Profile type structure
        const profileData: Profile = {
          id: data.id,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          genres: data.genres || [],
          skills: data.skills || [],
          pinned_work: {
            title: data.pinned_work?.title || "",
            content: data.pinned_work?.content || "",
            link: data.pinned_work?.link || "",
          },
          social_links: {
            website: data.social_links?.website || "",
            twitter: data.social_links?.twitter || "",
            instagram: data.social_links?.instagram || "",
            newsletter: data.social_links?.newsletter || "",
          },
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Navigation />
        {session && <UserMenu profile={profile} />}
      </div>
    </header>
  );
};