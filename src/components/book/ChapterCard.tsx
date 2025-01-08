import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChapterCardProps {
  chapter: any;
  isActive: boolean;
  onClick: () => void;
}

export const ChapterCard = ({ chapter, isActive, onClick }: ChapterCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-colors ${
        isActive ? 'border-violet-500 bg-violet-50' : 'hover:border-violet-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{chapter.title}</CardTitle>
      </CardHeader>
      {chapter.description && (
        <CardContent className="p-4 pt-0 text-sm text-gray-600">
          {chapter.description}
        </CardContent>
      )}
    </Card>
  );
};