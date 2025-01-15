import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/story";
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

interface DocumentsListProps {
  documents: Document[];
  onSelectDocument: (documentId: string) => void;
  selectedDocumentId: string | null;
  isGridView: boolean;
}

export const DocumentsList = ({
  documents,
  onSelectDocument,
  selectedDocumentId,
  isGridView,
}: DocumentsListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteDocument = async (document: Document) => {
    try {
      // First, get all section IDs for this document
      const { data: sections } = await supabase
        .from("document_sections")
        .select("id")
        .eq("document_id", document.id);

      if (sections) {
        // Delete plot events referencing these sections
        for (const section of sections) {
          await supabase
            .from("plot_events")
            .delete()
            .eq("document_section_id", section.id);
        }
      }

      // Delete document sections
      await supabase
        .from("document_sections")
        .delete()
        .eq("document_id", document.id);

      // Delete document references
      await supabase
        .from("document_references")
        .delete()
        .eq("document_id", document.id);

      // Finally delete the document
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", document.id);

      if (error) throw error;

      // Only invalidate document-related queries
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });

      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
      
      // If the deleted document was selected, clear the selection
      if (selectedDocumentId === document.id) {
        onSelectDocument("");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (document: Document, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  if (isGridView) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {documents.map((document) => (
          <div
            key={document.id}
            className={`relative group p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedDocumentId === document.id
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-200"
            }`}
            onClick={() => onSelectDocument(document.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-500" />
              <button
                onClick={(e) => handleDeleteClick(document, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            <h3 className="font-medium text-gray-900">{document.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(document.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {documents.map((document) => (
        <div
          key={document.id}
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
            selectedDocumentId === document.id
              ? "bg-purple-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelectDocument(document.id)}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="font-medium text-gray-900">{document.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(document.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => handleDeleteClick(document, e)}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded transition-opacity"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      ))}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document and all its contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};