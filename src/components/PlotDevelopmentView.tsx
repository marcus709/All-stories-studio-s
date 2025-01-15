import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, BookOpen, ChevronDown, Trash2, Edit, FileText, Wand } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlotPointEditorDialog } from "./plot/PlotPointEditorDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useAI } from "@/hooks/useAI";

interface PlotEvent {
  id: string;
  title: string;
  description: string;
  stage: string;
  order_index: number;
  story_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  document_section_id: string;
}

export const PlotDevelopmentView = () => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customTemplateName, setCustomTemplateName] = useState("");
  const [selectedAIConfig, setSelectedAIConfig] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PlotEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<PlotEvent | null>(null);
  const { selectedStory } = useStory();
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { generateContent } = useAI();

  const { data: plotEvents = [] } = useQuery({
    queryKey: ["plotEvents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];

      const { data, error } = await supabase
        .from("plot_events")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("order_index", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch plot events",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: plotTemplates = [] } = useQuery({
    queryKey: ["plotTemplates", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from("plot_template_instances")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch plot templates",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: aiConfigurations = [] } = useQuery({
    queryKey: ["aiConfigurations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch AI configurations",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateEventMutation = useMutation({
    mutationFn: async (event: PlotEvent) => {
      const { error } = await supabase
        .from("plot_events")
        .update(event)
        .eq("id", event.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotEvents"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
      setIsEditorOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("plot_events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plotEvents"] });
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  const handleCreateTemplate = async () => {
    if (!selectedStory) return;

    try {
      const selectedAIConfigData = selectedAIConfig ? await supabase
        .from("ai_configurations")
        .select("*")
        .eq("id", selectedAIConfig)
        .single() : null;

      const context = {
        storyDescription: selectedStory.description || "",
        aiConfig: selectedAIConfigData?.data,
      };

      const templateSuggestions = await generateContent(
        `Create a plot template for: ${customTemplateName}`,
        "suggestions",
        context
      );

      if (templateSuggestions) {
        const { data: template, error } = await supabase
          .from("plot_template_instances")
          .insert([
            {
              user_id: session?.user?.id,
              story_id: selectedStory.id,
              name: customTemplateName,
              template_name: selectedTemplate || "custom",
              notes: JSON.stringify(templateSuggestions),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Template created successfully",
        });

        queryClient.invalidateQueries({ queryKey: ["plotTemplates"] });
        setIsTemplateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    }
  };

  const handleEventUpdate = (updatedEvent: PlotEvent) => {
    updateEventMutation.mutate(updatedEvent);
  };

  const handleEventDelete = (event: PlotEvent) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete.id);
    }
  };

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination || !selectedStory) return;

    const items = Array.from(plotEvents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      order_index: index,
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from("plot_events")
          .update({ order_index: update.order_index })
          .eq("id", update.id);

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["plotEvents"] });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update event order",
        variant: "destructive",
      });
    }
  }, [plotEvents, selectedStory, queryClient, toast]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Plot Development</h1>
        <Button onClick={() => setIsTemplateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Plot Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input
                placeholder="Enter template name"
                value={customTemplateName}
                onChange={(e) => setCustomTemplateName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>AI Configuration</Label>
              <Select
                value={selectedAIConfig}
                onValueChange={setSelectedAIConfig}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Configuration</SelectItem>
                  {aiConfigurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Plot Events</h2>
          <Timeline
            data={plotEvents}
            onDragEnd={handleDragEnd}
            renderItem={(event: PlotEvent) => (
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.stage}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      setSelectedEvent(event);
                      setIsEditorOpen(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEventDelete(event)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Templates</h2>
          <ScrollArea className="h-[500px]">
            {plotTemplates.map((template) => (
              <div
                key={template.id}
                className="mb-4 p-4 bg-white rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{template.name}</h3>
                  <Button variant="ghost" size="sm">
                    <LayoutTemplate className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {template.template_name}
                </p>
              </div>
            ))}
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Story Notes</h2>
          <Textarea
            placeholder="Add your story notes here..."
            className="min-h-[200px]"
          />
        </Card>
      </div>

      <PlotPointEditorDialog
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent?.title || ""}
        content={selectedEvent?.description || ""}
        storyId={selectedStory?.id || ""}
        timelineId={selectedEvent?.id || ""}
        onSave={async (content: string) => {
          if (selectedEvent) {
            await handleEventUpdate({
              ...selectedEvent,
              description: content
            });
          }
        }}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the plot event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};