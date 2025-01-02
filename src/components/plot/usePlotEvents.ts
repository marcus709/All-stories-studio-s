import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PlotEventType } from "./types";

export const usePlotEvents = (selectedStructure: string | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  // Fetch plot events
  const { data: plotEvents } = useQuery({
    queryKey: ["plotEvents", selectedStructure],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_events")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data as PlotEventType[];
    },
    enabled: !!selectedStructure,
  });

  // Add new plot event
  const addEventMutation = useMutation({
    mutationFn: async (newEvent: { title: string; description: string; stage: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("plot_events")
        .insert({
          title: newEvent.title,
          description: newEvent.description,
          stage: newEvent.stage,
          order_index: plotEvents?.length || 0,
          story_id: "current-story-id", // You'll need to get this from your app's state
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotEvents"] });
      toast({
        title: "Success",
        description: "Plot event added successfully",
      });
    },
  });

  return {
    plotEvents,
    addEventMutation,
  };
};