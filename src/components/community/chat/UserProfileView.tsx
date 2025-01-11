import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  website?: string | null;
}

export const UserProfileView = ({ userId, onBack }: { userId: string; onBack?: () => void }) => {
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
    <div className="p-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      )}
      <h2 className="text-xl font-semibold">{profile.username}</h2>
      {profile.avatar_url && (
        <img 
          src={profile.avatar_url} 
          alt={`${profile.username}'s avatar`}
          className="w-20 h-20 rounded-full my-4"
        />
      )}
      {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
    </div>
  );
};