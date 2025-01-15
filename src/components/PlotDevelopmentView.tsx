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
import { useToast } from "@/hooks/use-toast";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PlotPointEditorDialog } from "./plot/PlotPointEditorDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useAI } from "@/hooks/useAI";

type PlotTemplate = {
  name: string;
  plotPoints: string[];
  subEvents?: string[];
};

type SavedNote = {
  plotPoint: string;
  notes: {
    content: string;
    lastEdited?: string;
  } | null;
};

const plotTemplates: PlotTemplate[] = [
  {
    name: "Romance Template",
    plotPoints: [
      "Meet-Cute / First Encounter",
      "Initial Spark / Attraction",
      "Growing Connection",
      "Conflict / Misunderstanding",
      "Moment of Truth",
      "Reconciliation / Grand Gesture",
      "Resolution / HEA"
    ],
    subEvents: [
      "Minor side characters offering advice or complicating matters",
      "Moments of comedic relief—awkward dates, family dinners, or social slip-ups",
      "Personal revelations about each character's past",
      "Intimate 'close call' moments where romantic tension spikes"
    ]
  },
  {
    name: "Horror Template",
    plotPoints: [
      "Ordinary World",
      "Inciting Incident",
      "Unfolding Dread",
      "First Showdown",
      "Mounting Tension",
      "Climax / True Terror",
      "Aftermath / Survival or Doom"
    ],
    subEvents: [
      "Eerie foreshadowing (strange symbols, cryptic warnings)",
      "Tension-building set pieces (dark basements, locked rooms, night scenes)",
      "Internal conflicts—some characters don't believe the danger, leading to poor decisions",
      "Moments of false security that get shattered by the next scare"
    ]
  },
  {
    name: "Fantasy (Epic Quest) Template",
    plotPoints: [
      "Prologue / Mythic Backstory",
      "Call to Adventure",
      "Gathering Allies",
      "Crossing into the Unknown",
      "Trials & Tests",
      "Darkest Hour",
      "Climactic Battle",
      "Resolution / Return"
    ],
    subEvents: [
      "Encounters with wise mentors or magical beings providing cryptic clues",
      "Political intrigue among kingdoms or factions",
      "Internal conflicts—jealousy or distrust among allies",
      "Magical training sequences or artifact discoveries"
    ]
  },
  {
    name: "Science Fiction Template",
    plotPoints: [
      "Futuristic / Alternate Setting",
      "Inciting Problem",
      "Assembling the Crew",
      "Exploration / Investigation",
      "Technological / Moral Dilemma",
      "Escalation",
      "Climax",
      "Aftermath"
    ],
    subEvents: [
      "Tech breakdown or sabotage leading to tense repairs",
      "Internal conflicts—crew members with hidden agendas",
      "Cultural clash with alien species or futuristic societies",
      "Scientific breakthroughs that change the mission's course"
    ]
  },
  {
    name: "Detective / Crime Template",
    plotPoints: [
      "Crime Intro",
      "Investigator Hook",
      "Initial Clues & Suspects",
      "False Leads & Red Herrings",
      "Mounting Pressure",
      "Breakthrough",
      "Confrontation / Reveal",
      "Resolution"
    ],
    subEvents: [
      "Tense interrogations with suspects",
      "Evidence lab visits or forensic breakthroughs",
      "Shadowing / stakeout scenes",
      "Allies who unwittingly hide info or keep secrets"
    ]
  },
  {
    name: "Comedic Short Story Template",
    plotPoints: [
      "Setup",
      "Inciting Mishap",
      "Escalating Chaos",
      "Turning Point",
      "Peak Comedy Moment",
      "Resolution"
    ],
    subEvents: [
      "Minor pranks gone wrong",
      "Characters mishearing each other",
      "Overheard conversations that lead to comedic twists",
      "A comedic ally or sidekick who constantly worsens the situation"
    ]
  },
  {
    name: "Personal Essay Template",
    plotPoints: [
      "Opening Anecdote",
      "Context / Background",
      "Deep Dive / Reflection",
      "Main Conflict / Discovery",
      "Resolution / Growth",
      "Closing Insight"
    ],
    subEvents: [
      "Flashbacks to earlier life events that shaped your perspective",
      "Moments of epiphany—realizing a hidden truth about yourself or others",
      "Contrasting your past mindset with your present one"
    ]
  },
  {
    name: "Biography Template",
    plotPoints: [
      "Introduction",
      "Early Life",
      "Challenges & Turning Points",
      "Rise to Prominence",
      "Peak Achievements",
      "Obstacles / Setbacks",
      "Legacy & Later Years",
      "Conclusion"
    ],
    subEvents: [
      "Anecdotes that reveal character traits",
      "Key relationships that shaped decisions",
      "Cultural and historical context that influenced their path"
    ]
  },
  {
    name: "Historical Fiction Template",
    plotPoints: [
      "Historical Setting",
      "Protagonist's Intro",
      "Conflict Triggered by History",
      "Immediate Consequences",
      "Immersion in Historical Events",
      "Personal vs. Historical Stakes",
      "Climax",
      "Aftermath"
    ],
    subEvents: [
      "Scenes featuring real historical figures cameoing or guiding events",
      "Cultural details—food, customs, clothing",
      "Letters, diaries, or forms of communication typical of the era"
    ]
  },
  {
    name: "Children's Story Template",
    plotPoints: [
      "Friendly Introduction",
      "Problem or Quest",
      "Magical / Educational Encounters",
      "Challenges",
      "Climax",
      "Lesson Learned",
      "Happy Ending"
    ],
    subEvents: []
  }
];

export const PlotDevelopmentView = () => {
  const [plotData, setPlotData] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [timelineName, setTimelineName] = useState("");
  const [deleteTimelineId, setDeleteTimelineId] = useState<string | null>(null);
  const [editingPlotPoint, setEditingPlotPoint] = useState<{
    title: string;
    content: string;
    index: number;
  } | null>(null);
  const [selectedAIConfig, setSelectedAIConfig] = useState<string>("");
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: savedTimelines, refetch: refetchTimelines } = useQuery({
    queryKey: ["plot-timelines", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      
      const { data, error } = await supabase
        .from("plot_template_instances")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("last_used", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch saved timelines",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const resetAllStates = useCallback(() => {
    setPlotData([]);
    setSelectedTemplate(null);
    setTimelineName("");
    setEditingPlotPoint(null);
    setIsTemplateDialogOpen(false);
    setDeleteTimelineId(null);
  }, []);

  const deleteTimelineMutation = useMutation({
    mutationFn: async (timelineId: string) => {
      if (!timelineId) {
        throw new Error("No timeline ID provided");
      }

      const { error } = await supabase
        .from("plot_template_instances")
        .delete()
        .eq("id", timelineId);

      if (error) throw error;
      return timelineId;
    },
    onMutate: async (timelineId) => {
      await queryClient.cancelQueries({ queryKey: ["plot-timelines", selectedStory?.id] });
      
      const previousTimelines = queryClient.getQueryData(["plot-timelines", selectedStory?.id]);
      
      if (previousTimelines) {
        queryClient.setQueryData(
          ["plot-timelines", selectedStory?.id],
          (old: any[] | undefined) => old?.filter(t => t.id !== timelineId) || []
        );
      }
      
      return { previousTimelines };
    },
    onError: (error, variables, context) => {
      console.error("Error deleting timeline:", error);
      if (context?.previousTimelines) {
        queryClient.setQueryData(["plot-timelines", selectedStory?.id], context.previousTimelines);
      }
      toast({
        title: "Error",
        description: "Failed to delete timeline",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Timeline deleted successfully",
      });
    },
    onSettled: () => {
      setDeleteTimelineId(null);
      
      setTimeout(() => {
        resetAllStates();
        queryClient.invalidateQueries({ 
          queryKey: ["plot-timelines", selectedStory?.id],
          exact: true
        });
      }, 0);
    },
  });

  const loadSavedTimeline = useCallback(async (templateName: string) => {
    if (!templateName) {
      console.error("No template name provided");
      return;
    }

    try {
      const template = plotTemplates.find(t => t.name === templateName);
      if (!template) {
        console.error("Template not found:", templateName);
        toast({
          title: "Error",
          description: "Template not found",
          variant: "destructive",
        });
        return;
      }

      const { data: savedInstance, error: fetchError } = await supabase
        .from('plot_template_instances')
        .select('notes')
        .eq('story_id', selectedStory?.id)
        .eq('template_name', templateName)
        .single();

      if (fetchError) {
        console.error("Error fetching saved notes:", fetchError);
      }

      const savedNotes = (savedInstance?.notes || []) as SavedNote[];

      const newPlotData = template.plotPoints.map((point, index) => {
        const savedNote = savedNotes.find(note => note.plotPoint === point);
        const noteContent = savedNote?.notes?.content || '';

        return {
          title: point,
          content: (
            <div>
              <div className="flex justify-between items-start mb-4">
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
                  {point}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => setEditingPlotPoint({
                      title: point,
                      content: noteContent,
                      index
                    })}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {noteContent && (
                <div className="text-neutral-700 dark:text-neutral-300 text-xs md:text-sm whitespace-pre-wrap">
                  {noteContent}
                </div>
              )}
              <div className="mb-8">
                {template.subEvents && template.subEvents.map((subEvent, subIndex) => (
                  <div key={subIndex} className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                    ✅ {subEvent}
                  </div>
                ))}
              </div>
            </div>
          ),
          notes: noteContent
        };
      });

      setPlotData(newPlotData);

      if (selectedStory?.id && templateName) {
        const { error } = await supabase
          .from('plot_template_instances')
          .update({ last_used: new Date().toISOString() })
          .eq('story_id', selectedStory.id)
          .eq('template_name', templateName);

        if (error) {
          console.error("Error updating last_used timestamp:", error);
          toast({
            title: "Warning",
            description: "Timeline loaded but couldn't update last used timestamp",
            variant: "default",
          });
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

  const applyTemplate = useCallback(async (template: PlotTemplate) => {
    try {
      setSelectedTemplate(template);
      setTimelineName(template.name);
      setIsTemplateDialogOpen(true);
      
      const newPlotData = template.plotPoints.map((point, index) => ({
        title: point,
        content: (
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
                {point}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setEditingPlotPoint({
                  title: point,
                  content: "",
                  index
                })}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-8">
              {template.subEvents && template.subEvents.map((subEvent, subIndex) => (
                <div key={subIndex} className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                  ✅ {subEvent}
                </div>
              ))}
            </div>
          </div>
        ),
      }));

      setPlotData(newPlotData);
    } catch (error) {
      console.error("Error applying template:", error);
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive",
      });
    }
  }, [setSelectedTemplate, setTimelineName, setIsTemplateDialogOpen, setPlotData, toast]);

  const handleSaveTimeline = useCallback(async () => {
    if (!selectedStory?.id || !selectedTemplate || !timelineName) {
      toast({
        title: "Error",
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("plot_template_instances")
        .insert({
          user_id: session?.user?.id,
          story_id: selectedStory.id,
          name: timelineName,
          template_name: selectedTemplate.name,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline saved successfully",
      });

      setIsTemplateDialogOpen(false);
      resetAllStates();
      await refetchTimelines();
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        title: "Error",
        description: "Failed to save timeline",
        variant: "destructive",
      });
    }
  }, [selectedStory?.id, selectedTemplate, timelineName, session?.user?.id, toast, resetAllStates, refetchTimelines]);

  const handleUpdatePlotPoint = useCallback(async (content: string) => {
    if (!editingPlotPoint) return;
    
    try {
      const newPlotData = [...plotData];
      newPlotData[editingPlotPoint.index] = {
        ...newPlotData[editingPlotPoint.index],
        content: (
          <div>
            <div className="flex justify-between items-start mb-4">
              <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal">
                {editingPlotPoint.title}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => setEditingPlotPoint({
                    title: editingPlotPoint.title,
                    content: content,
                    index: editingPlotPoint.index
                  })}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {content && (
              <div className="text-neutral-700 dark:text-neutral-300 text-xs md:text-sm whitespace-pre-wrap">
                {content}
              </div>
            )}
          </div>
        ),
        notes: content
      };

      setPlotData(newPlotData);
      setEditingPlotPoint(null);

      if (selectedStory?.id && timelineName) {
        const formattedNotes = newPlotData.map(point => ({
          plotPoint: point.title,
          notes: point.notes ? {
            content: point.notes,
            lastEdited: new Date().toISOString()
          } : null
        }));

        const { error } = await supabase
          .from('plot_template_instances')
          .update({ 
            notes: formattedNotes
          })
          .eq('story_id', selectedStory.id)
          .eq('name', timelineName);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Plot point notes updated successfully",
      });
    } catch (error) {
      console.error("Error updating plot point:", error);
      toast({
        title: "Error",
        description: "Failed to update plot point",
        variant: "destructive",
      });
    }
  }, [plotData, editingPlotPoint, setPlotData, selectedStory?.id, timelineName, toast]);

  const [isCustomTemplateDialogOpen, setIsCustomTemplateDialogOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const { generateContent, isLoading: isGeneratingTemplate } = useAI();

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

  const handleCreateCustomTemplate = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description for your template",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedAIConfigData = selectedAIConfig ? await supabase
        .from("ai_configurations")
        .select("*")
        .eq("id", selectedAIConfig)
        .single() : null;

      const systemPrompt = `Create a story template based on the following description. The response MUST be a valid JSON object with this exact structure:
{
  "name": "Template Name",
  "plotPoints": ["Point 1", "Point 2", "Point 3"],
  "subEvents": ["Sub Event 1", "Sub Event 2"]
}
Keep plot points between 5-8 points, and sub-events between 3-5 events. Make sure to escape any special characters.`;

      const result = await generateContent(
        customPrompt,
        "suggestions",
        {
          storyDescription: selectedStory?.description || "",
          aiConfig: selectedAIConfigData?.data || {
            model_type: "gpt-4o-mini",
            system_prompt: systemPrompt,
            temperature: 0.7,
            max_tokens: 1000,
          },
        }
      );

      if (result) {
        try {
          const cleanedResult = result.replace(/[\r\n\t]/g, '').trim();
          const template = JSON.parse(cleanedResult);
          
          if (!template.name || !Array.isArray(template.plotPoints)) {
            throw new Error("Invalid template structure");
          }
          
          applyTemplate(template);
          setIsCustomTemplateDialogOpen(false);
          setCustomPrompt("");
          
          toast({
            title: "Success",
            description: "Custom template created successfully",
          });
        } catch (parseError) {
          console.error("Error parsing template:", parseError);
          toast({
            title: "Error",
            description: "Failed to create template. Please try again with a different description.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error generating template:", error);
      toast({
        title: "Error",
        description: "Failed to generate template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Plot Development Timeline</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your story's progression through the three-act structure
          </p>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Acts</h3>
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{plotData.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total story acts</p>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <Button 
              onClick={() => {}}
              className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Act
            </Button>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-col gap-4">
            {savedTimelines && savedTimelines.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Saved Timelines
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {savedTimelines.map((saved) => (
                    <DropdownMenuItem
                      key={saved.id}
                      className="flex justify-between items-center"
                    >
                      <span 
                        className="flex-1 cursor-pointer"
                        onClick={() => loadSavedTimeline(saved.template_name)}
                      >
                        {saved.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTimelineId(saved.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LayoutTemplate className="h-5 w-5" />
                  Use Template
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Choose a Template</SheetTitle>
                  <SheetDescription>
                    Select a template or create a custom one to structure your story's plot points
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Button
                    onClick={() => setIsCustomTemplateDialogOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                  >
                    <Wand className="h-4 w-4 mr-2" />
                    Create Custom Template
                  </Button>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                      {plotTemplates.map((template, index) => (
                        <Card
                          key={index}
                          className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                          onClick={() => applyTemplate(template)}
                        >
                          <h3 className="text-lg font-semibold text-purple-600 mb-2">{template.name}</h3>
                          <div className="space-y-2">
                            {template.plotPoints.map((point, pointIndex) => (
                              <p key={pointIndex} className="text-sm text-gray-600 dark:text-gray-300">
                                {pointIndex + 1}. {point}
                              </p>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </Card>
        </div>

        <div className="w-full">
          <Timeline data={plotData} />
        </div>
      </div>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Timeline</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="timelineName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Timeline Name
            </label>
            <Input
              id="timelineName"
              value={timelineName}
              onChange={(e) => setTimelineName(e.target.value)}
              placeholder="Enter a name for your timeline"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTimeline}>
              Create Timeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTimelineId} onOpenChange={() => setDeleteTimelineId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this timeline. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTimelineId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                if (deleteTimelineId) {
                  deleteTimelineMutation.mutate(deleteTimelineId);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingPlotPoint && (
        <PlotPointEditorDialog
          isOpen={!!editingPlotPoint}
          onClose={() => setEditingPlotPoint(null)}
          title={editingPlotPoint.title}
          content={editingPlotPoint.content}
          storyId={selectedStory?.id || ""}
          timelineId={savedTimelines?.[0]?.id || ""}
          onSave={handleUpdatePlotPoint}
        />
      )}

      <Dialog open={isCustomTemplateDialogOpen} onOpenChange={setIsCustomTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>AI Configuration</Label>
              <Select
                value={selectedAIConfig}
                onValueChange={setSelectedAIConfig}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default Configuration</SelectItem>
                  {aiConfigurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your story template (e.g., 'Create a template for a mystery story where the protagonist is an amateur detective investigating a series of art thefts')"
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCustomTemplate}
              disabled={isGeneratingTemplate || !customPrompt.trim()}
              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
            >
              {isGeneratingTemplate ? (
                <>
                  <Wand className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand className="h-4 w-4 mr-2" />
                  Generate Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
