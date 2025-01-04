import { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface DocumentsListProps {
  documents: any[];
  selectedDocId: string | null;
  onSelectDocument: (id: string) => void;
  onRefresh: () => void;
}

export const DocumentsList = ({
  documents,
  selectedDocId,
  onSelectDocument,
  onRefresh,
}: DocumentsListProps) => {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!documentToDelete) return;

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Document deleted successfully",
    });

    if (selectedDocId === documentToDelete) {
      onSelectDocument("");
    }
    onRefresh();
    setDocumentToDelete(null);
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            selectedDocId === doc.id
              ? "bg-purple-100"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelectDocument(doc.id)}
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{doc.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      ))}

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