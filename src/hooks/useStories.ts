import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";
import { useToast } from "@/hooks/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

export function useStories() {
  const { toast } = useToast();
  const { session, isLoading: isSessionLoading } = useSessionContext();

  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      try {
        if (!session?.user) {
          throw new Error("User must be logged in to view stories");
        }

        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("user_id", session.user.id)
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
    enabled: !!session?.user && !isSessionLoading,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Only retry network errors, not auth errors
      if (error instanceof Error && error.message.includes("logged in")) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: true,
  });
}