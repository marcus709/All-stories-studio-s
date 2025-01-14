import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DocumentNavigationProps {
  content: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DocumentNavigation = ({ 
  content, 
  isCollapsed, 
  onToggleCollapse 
}: DocumentNavigationProps) => {
  const [viewportPosition, setViewportPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      
      const position = (scrollPosition / (documentHeight - windowHeight)) * 100;
      const height = (windowHeight / documentHeight) * 100;
      
      setViewportPosition(position);
      setViewportHeight(height);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isCollapsed) return null;

  const lines = content.split('\n').map(line => line.trim());
  const maxLineLength = Math.max(...lines.map(line => line.length));

  return (
    <div className="fixed left-12 top-16 w-16 h-[calc(100vh-4rem)] bg-gray-950 border-r flex flex-col">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-300"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div 
        ref={navigationRef}
        className="flex-1 mt-12 px-2 relative overflow-hidden"
      >
        <div className="absolute inset-0 mt-12">
          {lines.map((line, index) => {
            const width = (line.length / maxLineLength) * 100;
            return (
              <div
                key={index}
                className="h-[2px] mb-[1px] bg-gray-700"
                style={{ width: `${Math.max(width, 10)}%` }}
              />
            );
          })}
          <div
            className="absolute right-0 bg-gray-400/20 w-1"
            style={{
              top: `${viewportPosition}%`,
              height: `${viewportHeight}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};