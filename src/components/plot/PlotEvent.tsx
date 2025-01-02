import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { PlotEventType } from "./types";

interface PlotEventProps {
  event: PlotEventType;
}

export const PlotEvent = ({ event }: PlotEventProps) => {
  return (
    <div className="bg-gray-50 p-3 rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{event.title}</h4>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {event.description && (
        <p className="text-sm text-gray-600">{event.description}</p>
      )}
    </div>
  );
};