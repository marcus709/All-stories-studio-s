import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChapterCard } from "./ChapterCard";

interface ChapterViewProps {
  structure: string;
  activeChapter: string | null;
  onChapterClick: (chapterId: string) => void;
}

export const ChapterView = ({
  structure,
  activeChapter,
  onChapterClick,
}: ChapterViewProps) => {
  const { data: chapters } = useQuery({
    queryKey: ["chapters", structure],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plot_events")
        .select("*")
        .eq("stage", structure)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="space-y-4 p-4">
        {chapters?.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            isActive={activeChapter === chapter.id}
            onClick={() => onChapterClick(chapter.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};