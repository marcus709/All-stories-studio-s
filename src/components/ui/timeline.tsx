import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface TimelineProps {
  data: Array<{
    title: string;
    content: React.ReactNode;
  }>;
  onWriteClick?: (item: any) => void;
}

export const Timeline = ({ data, onWriteClick }: TimelineProps) => {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-12 relative">
        {data.map((item, index) => (
          <div key={index} className="relative">
            <div className="absolute left-0 top-3 w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
              <span className="text-violet-600 dark:text-violet-300 text-sm font-medium">
                {index + 1}
              </span>
            </div>
            <div className="ml-16">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                {onWriteClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onWriteClick(item)}
                  >
                    <Pencil className="h-4 w-4" />
                    Write
                  </Button>
                )}
              </div>
              <div className="prose prose-violet dark:prose-invert max-w-none">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
