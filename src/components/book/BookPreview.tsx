
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookPreviewProps {
  selectedDocument: string | null;
  onDocumentSelect: (id: string) => void;
}

interface PlotEvent {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

export const BookPreview = ({
  selectedDocument,
  onDocumentSelect,
}: BookPreviewProps) => {
  const { data: chapters } = useQuery({
    queryKey: ["chapters", selectedDocument],
    queryFn: async () => {
      if (!selectedDocument) return null;
      const { data, error } = await supabase
        .from("plot_events")
        .select("*")
        .eq("document_id", selectedDocument)
        .order("order_index");
      if (error) throw error;
      return data as PlotEvent[];
    },
    enabled: !!selectedDocument,
  });

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="prose max-w-none">
        {chapters?.map((chapter) => (
          <div key={chapter.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
            <div className="text-gray-700">{chapter.description}</div>
          </div>
        ))}
        {!chapters?.length && (
          <div className="text-center text-gray-500 py-8">
            Select or create a chapter to start writing
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
