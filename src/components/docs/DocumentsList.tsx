import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, FileText, Plus, MoreVertical, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShareDocumentDialog } from "./ShareDocumentDialog";
import { Document } from "@/types/story";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentsListProps {
  documents: Document[];
  onSelectDocument: (id: string) => void;
  selectedDocumentId: string | null;
  isGridView: boolean;
}

export const DocumentsList = ({ 
  documents, 
  onSelectDocument, 
  selectedDocumentId,
  isGridView 
}: DocumentsListProps) => {
  const [shareDocument, setShareDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      // First delete all plot events that reference document sections
      const { data: sections } = await supabase
        .from('document_sections')
        .select('id')
        .eq('document_id', documentToDelete.id);

      if (sections && sections.length > 0) {
        const sectionIds = sections.map(section => section.id);
        
        // Delete plot events referencing these sections
        const { error: plotEventsError } = await supabase
          .from('plot_events')
          .delete()
          .in('document_section_id', sectionIds);

        if (plotEventsError) throw plotEventsError;
      }

      // Then delete all document sections
      const { error: sectionsError } = await supabase
        .from('document_sections')
        .delete()
        .eq('document_id', documentToDelete.id);

      if (sectionsError) throw sectionsError;

      // Then delete all document references
      const { error: referencesError } = await supabase
        .from('document_references')
        .delete()
        .eq('document_id', documentToDelete.id);

      if (referencesError) throw referencesError;

      // Finally delete the document itself
      const { error: documentError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete.id);

      if (documentError) throw documentError;

      toast({
        title: "Document deleted",
        description: "The document and its related content have been successfully deleted",
      });

      // Invalidate the documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDocumentToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!documents?.length) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          No documents uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <ScrollArea className={`h-[calc(100vh-16rem)] ${isGridView ? 'px-6' : 'px-4'}`}>
        <div className={`${
          isGridView 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' 
            : 'flex flex-col space-y-2'
        }`}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`
                group relative
                ${isGridView 
                  ? 'aspect-[4/5] border rounded-lg transition-shadow hover:shadow-md cursor-pointer bg-white' 
                  : 'p-4 border rounded-lg transition-colors cursor-pointer hover:border-purple-500'
                }
                ${selectedDocumentId === doc.id 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-gray-200'
                }
              `}
            >
              {isGridView ? (
                <>
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <div className="aspect-[8.5/11] bg-gray-50 rounded mb-3 p-2 text-[8px] overflow-hidden text-gray-400">
                        {doc.content}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm truncate text-gray-900">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setShareDocument(doc);
                        }}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDocumentToDelete(doc);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3">
                  <FileText className={`h-5 w-5 ${
                    selectedDocumentId === doc.id 
                      ? 'text-purple-500' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      selectedDocumentId === doc.id 
                        ? 'text-purple-700' 
                        : 'text-gray-900'
                    }`}>
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareDocument(doc);
                      }}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocumentToDelete(doc);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {isGridView && (
        <Button
          className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg"
          onClick={() => {/* Trigger new document creation */}}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <ShareDocumentDialog
        document={shareDocument!}
        open={!!shareDocument}
        onOpenChange={(open) => !open && setShareDocument(null)}
      />

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              "{documentToDelete?.title}" and all its related content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
