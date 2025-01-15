import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlotTimelineProps {
  timeline: {
    id: string;
    name: string;
    template_name: string;
  };
  onDelete: () => void;
  onLoad: () => void;
}

export const PlotTimeline = ({ timeline, onDelete, onLoad }: PlotTimelineProps) => {
  return (
    <ScrollArea className="h-[200px]">
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{timeline.name}</h3>
            <p className="text-sm text-gray-500">{timeline.template_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onLoad}>
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </ScrollArea>
  );
};