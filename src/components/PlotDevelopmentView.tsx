import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
      "Internal conflicts—some characters don’t believe the danger, leading to poor decisions",
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
      "Scientific breakthroughs that change the mission’s course"
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
      "Protagonist’s Intro",
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
    name: "Children’s Story Template",
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
  {
    title: "Act 2",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Rising Action and Complications
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Develop subplots
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Increase tension
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Character development
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Act 3",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Resolution and Conclusion
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Climactic scene
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Resolve conflicts
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Character arcs completion
          </div>
        </div>
      </div>
    ),
  },
];

export const PlotDevelopmentView = () => {
  const [plotData, setPlotData] = useState(initialPlotData);
  const [selectedTemplate, setSelectedTemplate] = useState<PlotTemplate | null>(null);
  const [isNamingDialogOpen, setIsNamingDialogOpen] = useState(false);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { selectedStory } = useStory();
  const queryClient = useQueryClient();

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

  const createTimelineDocument = async (template: PlotTemplate, title: string) => {
    if (!selectedStory?.id) return;
    
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error("User not authenticated");

      // Create a new document
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .insert({
          title: title,
          story_id: selectedStory.id,
          user_id: user.id,
          content: '',
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Create a document section for the timeline
      const { data: section, error: sectionError } = await supabase
        .from('document_sections')
        .insert({
          document_id: document.id,
          type: 'timeline',
          title: 'Plot Timeline',
          content: JSON.stringify(template.plotPoints),
          order_index: 0,
        })
        .select()
        .single();

      if (sectionError) throw sectionError;

      // Create plot events
      const plotEvents = template.plotPoints.map((point, index) => ({
        story_id: selectedStory.id,
        user_id: user.id,
        stage: point,
        title: point,
        description: template.subEvents?.[index] || "Development Stage",
        order_index: index,
        document_section_id: section.id,
      }));

      const { error: eventsError } = await supabase
        .from('plot_events')
        .insert(plotEvents);

      if (eventsError) throw eventsError;

      // Invalidate queries to refresh the documents list
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      toast({
        title: "Timeline Created",
        description: `Timeline "${title}" has been created and saved to your documents.`,
      });

      return document;
    } catch (error) {
      console.error('Error creating timeline document:', error);
      toast({
        title: "Error",
        description: "Failed to create timeline document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const applyTemplate = async (template: PlotTemplate) => {
    setSelectedTemplate(template);
    setTimelineTitle(`${template.name} Timeline`);
    setIsNamingDialogOpen(true);
  };

  const handleTimelineCreate = async () => {
    if (!selectedTemplate || !timelineTitle.trim()) return;

    const document = await createTimelineDocument(selectedTemplate, timelineTitle);
    if (document) {
      const newPlotData = selectedTemplate.plotPoints.map((point, index) => ({
        title: point,
        content: (
          <div>
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
              {selectedTemplate.subEvents?.[index] || "Development Stage"}
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
      }));

      setPlotData(newPlotData);
      setIsNamingDialogOpen(false);

      // Scroll to timeline after a short delay
      setTimeout(() => {
        if (timelineRef.current) {
          const yOffset = -100;
          const y = timelineRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
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
                      </SheetClose>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </Card>
        </div>

        <div className="w-full" ref={timelineRef}>
          <Timeline data={plotData} />
        </div>
      </div>

      <Dialog open={isNamingDialogOpen} onOpenChange={setIsNamingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Timeline</DialogTitle>
            <DialogDescription>
              Enter a name for your timeline. This will be used to create a document in your story.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={timelineTitle}
              onChange={(e) => setTimelineTitle(e.target.value)}
              placeholder="Enter timeline name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNamingDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTimelineCreate}
              disabled={!timelineTitle.trim() || isProcessing}
            >
              {isProcessing ? "Creating..." : "Create Timeline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
