import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, List, ArrowUp, ArrowDown, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface PlotStructure {
  id: string;
  name: string;
  stages: string[];
}

interface PlotEvent {
  id: string;
  story_id: string;
  stage: string;
  title: string;
  description: string | null;
  order_index: number;
}

export const PlotDevelopmentView = () => {
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [activeStage, setActiveStage] = useState<string | null>(null);
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

  // Fetch plot structures
  const { data: plotStructures } = useQuery({
    queryKey: ["plotStructures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_structures")
        .select("*");
      if (error) throw error;
      return data as PlotStructure[];
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
      return data as PlotEvent[];
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
      setNewEvent({ title: "", description: "" });
      toast({
        title: "Success",
        description: "Plot event added successfully",
      });
    },
  });

  const handleAddEvent = () => {
    if (!activeStage) return;
    addEventMutation.mutate({
      ...newEvent,
      stage: activeStage,
    });
  };

  const selectedStructureData = plotStructures?.find(
    (structure) => structure.id === selectedStructure
  );

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plot Development</h1>
          <p className="text-gray-500">Plan and structure your story</p>
        </div>
      </div>

      <div className="mb-6">
        <Select
          value={selectedStructure || ""}
          onValueChange={(value) => {
            setSelectedStructure(value);
            setActiveStage(null);
          }}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a plot structure" />
          </SelectTrigger>
          <SelectContent>
            {plotStructures?.map((structure) => (
              <SelectItem key={structure.id} value={structure.id}>
                {structure.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStructureData && (
        <div className="grid grid-cols-3 gap-6">
          {selectedStructureData.stages.map((stage) => (
            <div
              key={stage}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="font-semibold mb-4 text-lg">{stage}</h3>
              
              <div className="space-y-4">
                {plotEvents
                  ?.filter((event) => event.stage === stage)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-50 p-3 rounded-md space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}

                {activeStage === stage ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Event description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setActiveStage(null);
                          setNewEvent({ title: "", description: "" });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddEvent}>Add Event</Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveStage(stage)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};