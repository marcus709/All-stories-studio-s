import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewMode, viewModeLabels } from "../types";
import { viewModeIcons } from "./icons";

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
        <ScrollArea className="h-[400px] w-[350px] rounded-md">
          {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => (
            <SelectItem key={mode} value={mode}>
              <div className="flex items-center gap-2 py-1">
                {viewModeIcons[mode] && React.createElement(viewModeIcons[mode], { className: "w-4 h-4" })}
                <span>{viewModeLabels[mode]}</span>
              </div>
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};