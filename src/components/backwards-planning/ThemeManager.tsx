import { useQuery } from "@tanstack/react-query";
import { useStory } from "@/contexts/StoryContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const ThemeManager = () => {
  const { selectedStory } = useStory();

  const { data: milestones } = useQuery({
    queryKey: ["milestones", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return [];
      const { data, error } = await supabase
        .from("backwards_planning_milestones")
        .select("*")
        .eq("story_id", selectedStory.id)
        .eq("milestone_type", "theme_setup")
        .order("position");

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  const { data: ending } = useQuery({
    queryKey: ["storyEnding", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory?.id) return null;
      const { data, error } = await supabase
        .from("backwards_story_endings")
        .select("*")
        .eq("story_id", selectedStory.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedStory?.id,
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Themes & Messages</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Final Themes</h3>
            <div className="flex flex-wrap gap-2">
              {ending?.key_themes.map((theme: string) => (
                <Badge key={theme} variant="secondary">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Theme Setup Points</h3>
            <div className="space-y-4">
              {milestones?.map((milestone) => (
                <Card key={milestone.id} className="p-4">
                  <h4 className="font-medium">{milestone.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {milestone.theme_connections?.map((theme: string) => (
                      <Badge key={theme} variant="outline">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};