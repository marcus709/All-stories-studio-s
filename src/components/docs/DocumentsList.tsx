import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { ShareDocumentDialog } from "@/components/community/chat/ShareDocumentDialog";

interface Document {
  id: string;
  title: string;
  content: string;
}

interface DocumentsListProps {
  documents: Document[];
  onSelectDocument: (id: string) => void;
  selectedDocumentId: string | null;
}

export const DocumentsList = ({ documents, onSelectDocument, selectedDocumentId }: DocumentsListProps) => {
  const [shareDocument, setShareDocument] = useState<Document | null>(null);

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
            selectedDocumentId === doc.id
              ? "bg-purple-50 border-purple-200"
              : "hover:bg-gray-50 border-transparent"
          } border`}
        >
          <div
            className="flex-1"
            onClick={() => onSelectDocument(doc.id)}
          >
            <h3 className="font-medium">{doc.title}</h3>
          </div>
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
        </div>
      ))}

      <ShareDocumentDialog
        document={shareDocument!}
        open={!!shareDocument}
        onOpenChange={(open) => !open && setShareDocument(null)}
      />
    </div>
  );
};