import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentNavigationSidebarProps {
  content: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DocumentNavigationSidebar = ({
  content,
  isCollapsed,
  onToggleCollapse
}: DocumentNavigationSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewportIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !viewportIndicatorRef.current || !contentRef.current) return;

      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      // Calculate the visible portion ratio
      const visibleRatio = windowHeight / documentHeight;
      
      // Calculate the scroll progress
      const scrollProgress = scrollTop / (documentHeight - windowHeight);
      
      // Update the viewport indicator
      const sidebarHeight = sidebarRef.current.clientHeight;
      const indicatorHeight = Math.max(30, sidebarHeight * visibleRatio);
      const maxScroll = sidebarHeight - indicatorHeight;
      const indicatorTop = maxScroll * scrollProgress;

      viewportIndicatorRef.current.style.height = `${indicatorHeight}px`;
      viewportIndicatorRef.current.style.top = `${indicatorTop}px`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [content]);

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-16 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="ml-2 mt-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Split content into lines and create minimap
  const lines = content.split('\n');

  return (
    <div className="fixed left-0 top-16 w-12 h-[calc(100vh-4rem)] bg-gray-100/50 flex flex-col">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="absolute -right-8 top-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div
        ref={sidebarRef}
        className="relative flex-1 mx-1 overflow-hidden"
      >
        {/* Minimap content */}
        <div 
          ref={contentRef}
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{ fontSize: '1px', lineHeight: '2px' }}
        >
          {lines.map((line, i) => (
            <div 
              key={i}
              className="whitespace-pre h-[2px] bg-gray-400/20"
              style={{ 
                width: `${Math.min(100, line.length)}%`,
                opacity: line.trim() ? 0.5 : 0.1
              }}
            />
          ))}
        </div>

        {/* Viewport indicator */}
        <div
          ref={viewportIndicatorRef}
          className={cn(
            "absolute left-0 w-full",
            "bg-gray-400/50 rounded-sm transition-all duration-150"
          )}
        />
      </div>
    </div>
  );
};