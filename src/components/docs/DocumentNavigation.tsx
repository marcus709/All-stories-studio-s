import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const navigationRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [viewportPosition, setViewportPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(20);

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

    const handleMinimapClick = (e: MouseEvent) => {
      if (!minimapRef.current || !navigationRef.current) return;
      
      const { top, height } = minimapRef.current.getBoundingClientRect();
      const clickPosition = (e.clientY - top) / height;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      window.scrollTo({
        top: clickPosition * (documentHeight - windowHeight),
        behavior: 'smooth'
      });
    };

    const handleMouseDown = () => {
      isDragging.current = true;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !minimapRef.current) return;
      handleMinimapClick(e);
    };

    const minimap = minimapRef.current;
    if (minimap) {
      minimap.addEventListener('mousedown', handleMouseDown);
      minimap.addEventListener('click', handleMinimapClick);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (minimap) {
        minimap.removeEventListener('mousedown', handleMouseDown);
        minimap.removeEventListener('click', handleMinimapClick);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []);

  const lines = content.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length));

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-72 border-r bg-white">
      <div className="h-full flex flex-col">
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
        
        <div className="flex-1 overflow-hidden relative" ref={navigationRef}>
          <div ref={minimapRef} className="absolute inset-0 p-4">
            {lines.map((line, index) => {
              const width = (line.length / maxLineLength) * 100;
              return (
                <div
                  key={index}
                  className={cn(
                    "h-[2px] mb-[1px] transition-all duration-75",
                    line.length > 0 ? "bg-gray-200" : "bg-transparent"
                  )}
                  style={{ width: `${Math.max(width, 10)}%` }}
                />
              );
            })}
            <div
              className="absolute right-0 bg-gray-400/20 w-1 transition-all duration-75"
              style={{
                top: `${viewportPosition}%`,
                height: `${viewportHeight}%`,
                opacity: isDragging.current ? '0.4' : '0.2'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
