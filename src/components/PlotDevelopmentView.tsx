import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaveTimelineDialog } from "./plot/SaveTimelineDialog";
import { WritingDialog } from "./plot/WritingDialog";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PlotTemplate = {
  name: string;
  plotPoints: string[];
  subEvents?: string[];
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
    subEvents: []
  },
  // ... other templates
];

const initialPlotData = [
  {
    title: "Act 1",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Setup and Introduction
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Introduce main characters
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Establish the setting
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Present the initial conflict
          </div>
        </div>
      </div>
    ),
  },
  // ... other acts
];

export const PlotDevelopmentView = () => {
  const [plotData, setPlotData] = useState(initialPlotData);
  const [selectedTemplate, setSelectedTemplate] = useState<PlotTemplate | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showWritingDialog, setShowWritingDialog] = useState(false);
  const [selectedPlotEvent, setSelectedPlotEvent] = useState<any>(null);
  const [timelineDocument, setTimelineDocument] = useState<any>(null);
  const { selectedStory } = useStory();
  const { toast } = useToast();

  const addNewAct = () => {
    const newActNumber = plotData.length + 1;
    setPlotData([
      ...plotData,
      {
        title: `Act ${newActNumber}`,
        content: (
          <div>
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
              New Act Development
            </p>
            <div className="mb-8">
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Define key events
              </div>
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Advance the plot
              </div>
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Further character growth
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };

  const handleTemplateSelect = (template: PlotTemplate) => {
    setSelectedTemplate(template);
    setShowSaveDialog(true);
  };

  const handleSaveTimeline = async (title: string) => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId || !selectedStory?.id) {
        throw new Error("User or story not found");
      }

      // Create document first
      const { data: document, error: docError } = await supabase
        .from("documents")
        .insert({
          title,
          story_id: selectedStory.id,
          user_id: userId,
          content: "",
        })
        .select()
        .single();

      if (docError) throw docError;
      setTimelineDocument(document);

      // Create plot events
      const plotEvents = selectedTemplate?.plotPoints.map((point, index) => ({
        story_id: selectedStory.id,
        user_id: userId,
        stage: point,
        title: point,
        description: "",
        order_index: index,
      }));

      if (plotEvents) {
        const { error: plotError } = await supabase
          .from("plot_events")
          .insert(plotEvents);

        if (plotError) throw plotError;
      }

      toast({
        title: "Success",
        description: "Timeline created successfully",
      });

      // Scroll to timeline after a short delay
      setTimeout(() => {
        if (timelineRef.current) {
          const yOffset = -100;
          const y = timelineRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("Error saving timeline:", error);
      toast({
        title: "Error",
        description: "Failed to create timeline",
        variant: "destructive",
      });
    }
  };

  const handleWriteClick = async (plotEvent: any) => {
    setSelectedPlotEvent(plotEvent);
    setShowWritingDialog(true);
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
              onClick={addNewAct}
              className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Act
            </Button>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full h-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LayoutTemplate className="h-5 w-5" />
                  Use Template
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Choose a Template</SheetTitle>
                  <SheetDescription>
                    Select a template to structure your story's plot points
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                  <div className="space-y-4 pr-4">
                    {plotTemplates.map((template, index) => (
                      <SheetClose key={index} asChild>
                        <Card
                          className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
                          onClick={() => handleTemplateSelect(template)}
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
                      </SheetClose>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </Card>
        </div>

        <div className="w-full" ref={timelineRef}>
          <Timeline 
            data={plotData}
            onWriteClick={handleWriteClick}
          />
        </div>
      </div>

      <SaveTimelineDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveTimeline}
        selectedTemplate={selectedTemplate?.name || null}
      />

      <WritingDialog
        isOpen={showWritingDialog}
        onClose={() => {
          setShowWritingDialog(false);
          setSelectedPlotEvent(null);
        }}
        plotEventId={selectedPlotEvent?.id || ""}
        documentId={timelineDocument?.id || ""}
        sectionId={selectedPlotEvent?.document_section_id || null}
        title={selectedPlotEvent?.title || ""}
        initialContent={selectedPlotEvent?.content || ""}
      />
    </div>
  );
};
