import { useState, useCallback } from "react";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlotTemplate } from "@/types/plot";
import { plotTemplates } from "@/lib/plot-templates";
import { PlotTimeline } from "./plot/PlotTimeline";
import { TemplatePanel } from "./plot/TemplatePanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, BookOpen, Plus } from "lucide-react";
import { EmotionTracker } from "./plot/EmotionTracker";
import { Card } from "@/components/ui/card";

export const PlotDevelopmentView = () => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<PlotTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [timelineName, setTimelineName] = useState("");
  const [plotData, setPlotData] = useState<any[]>([]);
  const [deleteTimelineId, setDeleteTimelineId] = useState<string | null>(null);

  const { data: timelines } = useQuery({
    queryKey: ["plot-timelines", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      
      const { data, error } = await supabase
        .from("plot_template_instances")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const resetAllStates = () => {
    setSelectedTemplate(null);
    setTimelineName("");
    setPlotData([]);
    setIsTemplateDialogOpen(false);
  };

  const deleteTimelineMutation = useMutation({
    mutationFn: async (timelineId: string) => {
      const { error } = await supabase
        .from("plot_template_instances")
        .delete()
        .eq("id", timelineId);

      if (error) throw error;
      return timelineId;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeline deleted successfully",
      });
      setDeleteTimelineId(null);
      resetAllStates();
      queryClient.invalidateQueries({ 
        queryKey: ["plot-timelines", selectedStory?.id],
        exact: true
      });
    },
    onError: (error) => {
      console.error("Error deleting timeline:", error);
      toast({
        title: "Error",
        description: "Failed to delete timeline",
        variant: "destructive",
      });
    }
  });

  const loadSavedTimeline = useCallback(async (templateName: string) => {
    if (!selectedStory?.id) return;

    try {
      console.log("Loading saved timeline:", templateName);
      
      const { data: existingTemplate, error: templateError } = await supabase
        .from("plot_template_instances")
        .select("*")
        .eq("story_id", selectedStory.id)
        .eq("template_name", templateName)
        .order("last_used", { ascending: false })
        .limit(1)
        .single();

      if (templateError && templateError.code !== 'PGRST116') {
        throw templateError;
      }

      if (existingTemplate) {
        console.log("Found existing template:", existingTemplate);
        
        const { data: plotPoints, error: plotError } = await supabase
          .from("plot_events")
          .select("*")
          .eq("story_id", selectedStory.id)
          .order("order_index", { ascending: true });

        if (plotError) throw plotError;

        if (plotPoints) {
          setPlotData(plotPoints);
          setTimelineName(existingTemplate.name);
          
          const matchingTemplate = plotTemplates.find(t => t.name === templateName);
          if (matchingTemplate) {
            setSelectedTemplate(matchingTemplate);
          }

          toast({
            title: "Success",
            description: "Timeline loaded successfully",
          });
        }

        const { error } = await supabase
          .from("plot_template_instances")
          .update({ last_used: new Date().toISOString() })
          .eq("id", existingTemplate.id);

        if (error) {
          console.error("Error updating last_used timestamp:", error);
        }
      }
    } catch (error) {
      console.error("Error loading timeline:", error);
      toast({
        title: "Error",
        description: "Failed to load timeline",
        variant: "destructive",
      });
    }
  }, [selectedStory?.id, toast]);

  const applyTemplate = useCallback((template: PlotTemplate) => {
    try {
      console.log("Applying template:", template);
      
      setSelectedTemplate(template);
      setTimelineName(template.name);
      
      const newPlotData = template.plotPoints.map((point, index) => ({
        id: crypto.randomUUID(),
        story_id: selectedStory?.id || "",
        user_id: "",
        stage: template.stages[Math.floor(index / (template.plotPoints.length / template.stages.length))] || "unknown",
        title: point,
        description: "",
        order_index: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        document_section_id: null
      }));

      setPlotData(newPlotData);
      setIsTemplateDialogOpen(true);
    } catch (error) {
      console.error("Error applying template:", error);
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive",
      });
    }
  }, [selectedStory?.id, toast]);

  const handleSaveTimeline = async () => {
    if (!selectedStory?.id || !selectedTemplate) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: templateInstance, error: templateError } = await supabase
        .from("plot_template_instances")
        .insert({
          story_id: selectedStory.id,
          template_name: selectedTemplate.name,
          name: timelineName,
          last_used: new Date().toISOString(),
          user_id: user?.id || "",
        })
        .select()
        .single();

      if (templateError) throw templateError;

      const plotEvents = plotData.map(event => ({
        ...event,
        template_instance_id: templateInstance.id,
      }));

      const { error: eventsError } = await supabase
        .from("plot_events")
        .insert(plotEvents);

      if (eventsError) throw eventsError;

      toast({
        title: "Success",
        description: "Timeline saved successfully",
      });

      queryClient.invalidateQueries({ 
        queryKey: ["plot-timelines", selectedStory.id],
        exact: true
      });
      
      setIsTemplateDialogOpen(false);
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        title: "Error",
        description: "Failed to save timeline",
        variant: "destructive",
      });
    }
  };

  if (!selectedStory) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please select a story to view plot development tools
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Plot Development</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Acts</h2>
            <BookOpen className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <span className="text-4xl font-bold text-violet-500">
              {plotData.length}
            </span>
            <p className="text-gray-500 mt-1">Total story acts</p>
          </div>
        </Card>

        <Card className="bg-violet-500 text-white p-6 cursor-pointer hover:bg-violet-600 transition-colors">
          <div className="flex items-center justify-center h-full">
            <Plus className="h-6 w-6 mr-2" />
            <span className="text-xl font-semibold">Add New Act</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold">Saved Timelines</h2>
            <Button 
              variant="outline" 
              className="w-full border-violet-200 text-violet-500 hover:bg-violet-50"
              onClick={() => setIsTemplateDialogOpen(true)}
            >
              Use Template
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-2">Plot Development Timeline</h2>
        <p className="text-gray-600 mb-8">
          Track your story's progression through the three-act structure
        </p>

        <div className="space-y-6">
          {plotData.map((event, index) => (
            <PlotTimeline
              key={event.id}
              timeline={event}
              onDelete={() => setDeleteTimelineId(event.id)}
              onLoad={() => loadSavedTimeline(event.stage)}
            />
          ))}
        </div>
      </div>

      <EmotionTracker
        plotEvents={plotData}
        selectedDocument={null}
        onDocumentSelect={() => {}}
      />

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTimeline}>
                Save Timeline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTimelineId} onOpenChange={() => setDeleteTimelineId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Timeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Are you sure you want to delete this timeline?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTimelineId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteTimelineId && deleteTimelineMutation.mutate(deleteTimelineId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};