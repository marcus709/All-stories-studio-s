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
    <div className="w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <Tabs defaultValue="characters">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Characters
          </TabsTrigger>
          <TabsTrigger value="plot" className="flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            Plot
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Ideas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="space-y-2">
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
              className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <h4 className="font-medium">{char.name}</h4>
              <p className="text-sm text-gray-500">{char.role}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="plot" className="space-y-2">
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
              className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-gray-500">{event.stage}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="ideas" className="space-y-2">
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
              className="p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <h4 className="font-medium">{idea.title}</h4>
              {idea.tag && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  {idea.tag}
                </span>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};