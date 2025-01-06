import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";
import { useToast } from "@/hooks/use-toast";

export function useStories() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error("User must be logged in to view stories");
        }

        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("user_id", session.session.user.id)
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Error fetching stories:", error);
          toast({
            title: "Error fetching stories",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        if (!data) {
          return [];
        }

        return data as Story[];
      } catch (error) {
        console.error("Error in stories query:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch stories",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: true,
  });
}