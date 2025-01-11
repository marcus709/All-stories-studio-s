import { DocumentsList } from "./DocumentsList";

interface DocumentSidebarProps {
  onContentDrop: () => void;
  selectedDocId: string | null;
  onSelectDocument: (id: string) => void;
  isGridView: boolean;
}

export const DocumentSidebar = ({ 
  onContentDrop, 
  selectedDocId, 
  onSelectDocument,
  isGridView 
}: DocumentSidebarProps) => {
  return (
    <div className="h-full border-r">
      <DocumentsList
        documents={[]}
        onSelectDocument={onSelectDocument}
        selectedDocumentId={selectedDocId}
        isGridView={isGridView}
      />
    </div>
  );
};