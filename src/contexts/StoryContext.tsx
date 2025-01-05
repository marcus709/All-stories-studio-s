import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/integrations/supabase/types/tables.types";

interface StoryContextType {
  selectedStory: Story | null;
  setSelectedStory: (story: Story | null) => void;
  stories: Story[];
  isLoading: boolean;
}

const StoryContext = createContext<StoryContextType | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      console.log("Fetching stories...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user found, returning empty array");
        return [];
      }

      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching stories:", error);
        throw error;
      }

      console.log("Stories fetched:", data);
      return data as Story[];
    },
  });

  return (
    <StoryContext.Provider value={{ selectedStory, setSelectedStory, stories, isLoading }}>
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