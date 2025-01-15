import { Card } from "@/components/ui/card";
import { Document } from "@/types/story";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onClick: () => void;
}

export const DocumentCard = ({ document, isSelected, onClick }: DocumentCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-pointer p-4 transition-all duration-200 hover:shadow-md",
        isSelected ? "border-violet-500 bg-violet-50" : "hover:border-violet-200"
      )}
      onClick={onClick}
    >
      <h3 className="font-medium mb-2">{document.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-3">{document.content}</p>
      <div className="mt-2 text-xs text-gray-500">
        Last updated: {new Date(document.updated_at || '').toLocaleDateString()}
      </div>
    </Card>
  );
};