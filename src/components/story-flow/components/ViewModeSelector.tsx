import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewMode, viewModeLabels } from "../types";
import { viewModeIcons } from "./icons";
import { LucideIcon } from 'lucide-react';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

export const ViewModeSelector = ({ viewMode, onViewModeChange }: ViewModeSelectorProps) => {
  return (
    <Select value={viewMode} onValueChange={onViewModeChange}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue>
          <div className="flex items-center gap-2">
            {viewModeIcons[viewMode] && React.createElement(viewModeIcons[viewMode], { 
              className: "h-4 w-4"
            })}
            <span>{viewModeLabels[viewMode]}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[200px] w-[180px] rounded-md">
          {(Object.keys(viewModeLabels) as ViewMode[]).map((mode) => {
            const Icon = viewModeIcons[mode] as LucideIcon;
            return (
              <SelectItem key={mode} value={mode}>
                <div className="flex items-center gap-2 py-1">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{viewModeLabels[mode]}</span>
                </div>
              </SelectItem>
            );
          })}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};