import { useQuery } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";

interface Document {
  id: string;
  title: string;
  created_at: string;
  content: any;
}

interface DocumentsGridProps {
  onSelectDocument: (id: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentsGrid = ({ onSelectDocument, selectedDocumentId }: DocumentsGridProps) => {
  const { selectedStory } = useStory();

  const { data: documents } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      if (!selectedStory) return [];
      
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
    enabled: !!selectedStory?.id,
  });

  if (!documents?.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          No documents uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelectDocument(doc.id)}
          className={`p-4 border rounded-lg transition-colors cursor-pointer group
            ${selectedDocumentId === doc.id 
              ? 'border-purple-500 bg-purple-50' 
              : 'hover:border-purple-500'
            }`}
        >
          <div className="flex items-start gap-3">
            <FileText className={`h-5 w-5 ${
              selectedDocumentId === doc.id 
                ? 'text-purple-500' 
                : 'text-gray-400 group-hover:text-purple-500'
            }`} />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                selectedDocumentId === doc.id 
                  ? 'text-purple-700' 
                  : 'text-gray-900 group-hover:text-purple-500'
              }`}>
                {doc.title}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};