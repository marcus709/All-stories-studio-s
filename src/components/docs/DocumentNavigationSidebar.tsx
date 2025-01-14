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
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !indicatorRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate the visible portion of the document
      const visibleRatio = windowHeight / documentHeight;
      const scrollRatio = scrollTop / (documentHeight - windowHeight);
      
      // Update the indicator position and height
      const sidebarHeight = sidebarRef.current.clientHeight;
      const indicatorHeight = Math.max(30, sidebarHeight * visibleRatio);
      const maxScroll = sidebarHeight - indicatorHeight;
      const indicatorTop = maxScroll * scrollRatio;

      indicatorRef.current.style.height = `${indicatorHeight}px`;
      indicatorRef.current.style.top = `${indicatorTop}px`;
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

  return (
    <div className="fixed left-0 top-16 w-6 h-[calc(100vh-4rem)] bg-gray-100/50 flex flex-col">
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
        className="relative flex-1 mx-1"
      >
        <div
          ref={indicatorRef}
          className={cn(
            "absolute left-0 w-full",
            "bg-gray-300/50 rounded-sm transition-all duration-150"
          )}
        />
      </div>
    </div>
  );
};