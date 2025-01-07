import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewMode, viewModeLabels } from "../types";
import { viewModeIcons } from "./icons";
import { LucideProps } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

export const ViewModeSelector = ({ viewMode, onViewModeChange }: ViewModeSelectorProps) => {
  return (
    <Select value={viewMode} onValueChange={onViewModeChange}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue>
          {viewModeLabels[viewMode]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[200px] w-[180px] rounded-md">
          {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => (
            <SelectItem key={mode} value={mode}>
              <div className="flex items-center gap-2 py-1">
                {viewModeIcons[mode] && React.createElement(viewModeIcons[mode], { 
                  className: "h-4 w-4"
                } as LucideProps)}
                <span>{viewModeLabels[mode]}</span>
              </div>
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};