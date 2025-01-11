import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfileDialog } from "@/components/community/UserProfileDialog";
import { Skeleton } from "@/components/ui/skeleton";

export const UserProfilePage = () => {
  const { userId } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <UserProfileDialog user={profile} isOpen={false} onClose={() => {}} showInDialog={false} />
    </div>
  );
};

export default UserProfilePage;