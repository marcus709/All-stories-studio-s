import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";

export function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error("User must be logged in to view stories");
      }

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", session.data.session.user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }

      return data as Story[];
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
  });
}