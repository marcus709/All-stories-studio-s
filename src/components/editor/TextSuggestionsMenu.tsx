import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Wand2,
  BookOpen,
  Minimize2,
  Scissors,
  Maximize2,
  SpellCheck2,
} from "lucide-react";

interface TextSuggestionsMenuProps {
  top: number;
  left: number;
  onSuggestion: (type: string) => void;
  isLoading?: boolean;
}

export function TextSuggestionsMenu({
  top,
  left,
  onSuggestion,
  isLoading = false,
}: TextSuggestionsMenuProps) {
  const handleSuggestion = (type: string) => {
    if (isLoading) return;
    onSuggestion(type);
  };

  const buttons = [
    {
      label: 'Improve',
      icon: Wand2,
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      onClick: () => handleSuggestion('Improve')
    },
    {
      label: 'Enhance',
      icon: BookOpen,
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      onClick: () => handleSuggestion('Enhance readability of')
    },
    {
      label: 'Shorten',
      icon: Minimize2,
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      onClick: () => handleSuggestion('Shorten')
    },
    {
      label: 'Simplify',
      icon: Scissors,
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      onClick: () => handleSuggestion('Simplify')
    },
    {
      label: 'Lengthen',
      icon: Maximize2,
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      onClick: () => handleSuggestion('Lengthen')
    },
    {
      label: 'Grammar',
      icon: SpellCheck2,
      gradient: 'from-indigo-400 via-indigo-500 to-indigo-600',
      onClick: () => handleSuggestion('Fix grammar in')
    }
  ];

  return (
    <div
      className="absolute z-50 flex flex-wrap gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: '420px',
        animation: 'scale-in 0.2s ease-out',
      }}
    >
      {buttons.map((button) => (
        <Button
          key={button.label}
          variant="ghost"
          size="sm"
          className={`
            h-8 px-3 
            rounded-full 
            bg-gradient-to-r ${button.gradient}
            hover:opacity-90 hover:scale-105
            text-white 
            transition-all duration-200
            flex items-center gap-1.5 
            text-xs font-medium
            shadow-md hover:shadow-lg
            border border-white/10
          `}
          onClick={button.onClick}
          disabled={isLoading}
        >
          <button.icon className="h-3.5 w-3.5" />
          {button.label}
        </Button>
      ))}
    </div>
  );
}