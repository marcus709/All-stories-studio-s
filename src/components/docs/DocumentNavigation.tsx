import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentNavigationProps {
  content: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface Heading {
  level: number;
  text: string;
  index: number;
}

export const DocumentNavigation = ({
  content,
  isCollapsed,
  onToggleCollapse,
}: DocumentNavigationProps) => {
  const parseHeadings = (content: string): Heading[] => {
    // Match both Markdown headings (#) and HTML headings (<h1>-<h6>)
    const headingRegex = /(?:^|\n)(?:#{1,6})\s+([^\n]+)|<h([1-6])>([^<]+)<\/h\2>/g;
    const headings: Heading[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const text = match[1] || match[3]; // match[1] for Markdown, match[3] for HTML
      const level = match[1] ? match[0].trim().indexOf(' ') : parseInt(match[2]);
      
      headings.push({
        level,
        text: text.trim(),
        index: index++
      });
    }

    return headings;
  };

  const headings = parseHeadings(content);

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
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4">
          {headings.map((heading, idx) => (
            <div
              key={`${heading.text}-${idx}`}
              className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-sm"
              style={{
                paddingLeft: `${(heading.level - 1) * 16 + 8}px`,
                color: heading.level === 1 ? 'black' : '#4B5563'
              }}
            >
              {heading.text}
            </div>
          ))}
          {headings.length === 0 && (
            <div className="text-sm text-gray-500 italic">
              No headings found in document
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};