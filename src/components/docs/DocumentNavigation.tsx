import { useState, useEffect, useRef } from "react";
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
  onToggleCollapse 
}: DocumentNavigationProps) => {
  const [viewportPosition, setViewportPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const navigationRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

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

  if (isCollapsed) return null;

  const lines = content.split('\n').map(line => line.trim());
  const maxLineLength = Math.max(...lines.map(line => line.length));

  return (
    <div className="w-16 h-full bg-white border-r flex flex-col shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 mt-12 px-2 relative overflow-hidden cursor-pointer" ref={navigationRef}>
        <div ref={minimapRef} className="absolute inset-0 mt-12">
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
  );
};