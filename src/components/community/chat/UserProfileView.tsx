import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/character";

export const UserProfileView = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState<"planned" | "exact" | "estimated">("planned");
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading("exact");
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile.",
          variant: "destructive",
        });
      } finally {
        setLoading("estimated");
      }
    };

    fetchProfile();
  }, [userId, toast]);

  if (loading === "planned") {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div>
      <h2>{profile.username}</h2>
      <img src={profile.avatar_url || ""} alt={`${profile.username}'s avatar`} />
      <p>{profile.bio}</p>
    </div>
  );
};
