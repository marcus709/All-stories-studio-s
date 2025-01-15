import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface DocumentNavigationProps {
  content: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DocumentNavigation = ({
  content,
  isCollapsed,
  onToggleCollapse,
}: DocumentNavigationProps) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-72 border-r bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-sm font-medium">Document Navigation</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        {content.split('\n').map((line, index) => (
          <div
            key={index}
            className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
          >
            {line.trim() || <span className="text-gray-400">Empty line</span>}
          </div>
        ))}
      </div>
    </div>
  );
};