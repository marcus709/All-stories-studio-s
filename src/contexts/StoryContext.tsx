import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Story } from "@/types/story";

interface StoryContextType {
  selectedStory: Story | null;
  setSelectedStory: (story: Story | null) => void;
  stories: Story[];
  isLoading: boolean;
  refetchStories: () => Promise<void>;
}

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { session } = useSessionContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading, refetch } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch stories",
          variant: "destructive",
        });
        throw error;
      }

      return data as Story[];
    },
    enabled: !!session?.user,
  });

  // Handle story deletion and selection cleanup
  useEffect(() => {
    if (selectedStory && stories.length > 0 && !stories.find(s => s.id === selectedStory.id)) {
      console.log("Selected story was deleted, updating selection...");
      setSelectedStory(stories[0]);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    } else if (stories.length === 0) {
      setSelectedStory(null);
    }
  }, [stories, selectedStory, queryClient]);

  const refetchStories = async () => {
    await refetch();
  };

  return (
    <StoryContext.Provider value={{ 
      selectedStory, 
      setSelectedStory, 
      stories, 
      isLoading,
      refetchStories 
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}