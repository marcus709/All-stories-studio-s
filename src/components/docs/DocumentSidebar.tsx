import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStory } from "@/contexts/StoryContext";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'character' | 'plot' | 'idea';
}

interface DocumentSidebarProps {
  onContentDrop: (content: ContentItem) => void;
  selectedDocId?: string | null;
  onSelectDocument: (id: string) => void;
}

export const DocumentSidebar = ({ 
  onContentDrop, 
  selectedDocId,
  onSelectDocument 
}: DocumentSidebarProps) => {
  const { selectedStory } = useStory();
  const { toast } = useToast();
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { data: documents, refetch: refetchDocuments } = useQuery({
    queryKey: ["documents", selectedStory?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("story_id", selectedStory?.id);
      return data || [];
    },
    enabled: !!selectedStory?.id,
  });

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      // If the deleted document was selected, clear the selection
      if (selectedDocId === documentToDelete) {
        onSelectDocument("");
      }

      refetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full h-full bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold">Documents</h2>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
        {documents?.map((doc) => (
          <div
            key={doc.id}
            className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
              selectedDocId === doc.id 
                ? 'bg-sidebar-accent/80' 
                : 'bg-sidebar-accent hover:bg-sidebar-accent/80'
            }`}
          >
            <div className="flex justify-between items-start">
              <div 
                className="flex-1"
                onClick={() => onSelectDocument(doc.id)}
              >
                <h4 className="font-medium text-sidebar-accent-foreground">{doc.title}</h4>
                <p className="text-sm text-sidebar-foreground/80">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger 
                  onClick={handleDropdownClick}
                  className="focus:outline-none"
                >
                  <MoreVertical className="w-4 h-4 text-sidebar-foreground/60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  onClick={handleDropdownClick}
                  side="right"
                  align="start"
                  className="bg-white"
                  sideOffset={5}
                >
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocumentToDelete(doc.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!documentToDelete}
        onOpenChange={() => setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};