import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { Users, LineChart, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'character' | 'plot' | 'idea';
}

export const DocumentSidebar = ({ onContentDrop }: { onContentDrop: (content: ContentItem) => void }) => {
  const { selectedStory } = useStory();

  const { data: characters } = useQuery({
    queryKey: ["characters", selectedStory?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("characters")
        .select("*")
        .eq("story_id", selectedStory?.id);
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const { data: plotEvents } = useQuery({
    queryKey: ["plot_events", selectedStory?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("plot_events")
        .select("*")
        .eq("story_id", selectedStory?.id);
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const { data: storyIdeas } = useQuery({
    queryKey: ["story_ideas", selectedStory?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("story_ideas")
        .select("*")
        .eq("story_id", selectedStory?.id);
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const handleDragStart = (e: React.DragEvent, item: ContentItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <Tabs defaultValue="characters" className="w-full">
        <TabsList className="w-full justify-start border-b border-sidebar-border rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="characters" 
            className="flex items-center gap-2 px-4 py-3 rounded-none data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <Users className="w-4 h-4" />
            Characters
          </TabsTrigger>
          <TabsTrigger 
            value="plot" 
            className="flex items-center gap-2 px-4 py-3 rounded-none data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <LineChart className="w-4 h-4" />
            Plot
          </TabsTrigger>
          <TabsTrigger 
            value="ideas" 
            className="flex items-center gap-2 px-4 py-3 rounded-none data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground"
          >
            <Lightbulb className="w-4 h-4" />
            Ideas
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="characters" className="m-0 space-y-2">
            {characters?.map((char) => (
              <div
                key={char.id}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  id: char.id,
                  title: char.name,
                  description: char.backstory || '',
                  type: 'character'
                })}
                className="p-3 bg-sidebar-accent rounded-lg cursor-move hover:bg-sidebar-accent/80 transition-colors"
              >
                <h4 className="font-medium text-sidebar-accent-foreground">{char.name}</h4>
                <p className="text-sm text-sidebar-foreground/80">{char.role}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="plot" className="m-0 space-y-2">
            {plotEvents?.map((event) => (
              <div
                key={event.id}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  id: event.id,
                  title: event.title,
                  description: event.description || '',
                  type: 'plot'
                })}
                className="p-3 bg-sidebar-accent rounded-lg cursor-move hover:bg-sidebar-accent/80 transition-colors"
              >
                <h4 className="font-medium text-sidebar-accent-foreground">{event.title}</h4>
                <p className="text-sm text-sidebar-foreground/80">{event.stage}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="ideas" className="m-0 space-y-2">
            {storyIdeas?.map((idea) => (
              <div
                key={idea.id}
                draggable
                onDragStart={(e) => handleDragStart(e, {
                  id: idea.id,
                  title: idea.title,
                  description: idea.description || '',
                  type: 'idea'
                })}
                className="p-3 bg-sidebar-accent rounded-lg cursor-move hover:bg-sidebar-accent/80 transition-colors"
              >
                <h4 className="font-medium text-sidebar-accent-foreground">{idea.title}</h4>
                {idea.tag && (
                  <span className="text-xs bg-sidebar-primary/10 text-sidebar-primary px-2 py-0.5 rounded-full">
                    {idea.tag}
                  </span>
                )}
              </div>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};