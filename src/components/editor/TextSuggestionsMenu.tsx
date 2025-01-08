import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../ui/button';
import {
  Wand2,
  BookOpen,
  Scissors,
  Minimize2,
  Maximize2,
  SpellCheck2,
} from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '../ui/use-toast';

interface TextSuggestionsMenuProps {
  editor: Editor | null;
  isOpen: boolean;
  top: number;
  left: number;
}

export function TextSuggestionsMenu({ editor, isOpen, top, left }: TextSuggestionsMenuProps) {
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();
  const menuWidth = 200; // Approximate width of the menu in pixels

  if (!isOpen) return null;

  const getSelectedText = () => {
    return editor?.state.doc.cut(
      editor.state.selection.from,
      editor.state.selection.to
    ).textContent;
  };

  const handleSuggestion = async (type: string) => {
    const selectedText = getSelectedText();
    if (!selectedText) return;

    try {
      const prompt = `${type} the following text while maintaining its context and meaning: ${selectedText}`;
      const improvedText = await generateContent(prompt, 'suggestions');
      
      if (improvedText) {
        editor
          .chain()
          .focus()
          .setTextSelection({
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          })
          .insertContent(improvedText)
          .run();

        toast({
          title: "Success",
          description: "Text has been updated",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestion",
        variant: "destructive",
      });
    }
  };

  // Calculate position to avoid menu being cut off at screen edges
  // and ensure it appears to the right of the selection
  const menuLeft = Math.min(
    left + 20, // Add 20px padding from the selection
    window.innerWidth - menuWidth - 20 // 20px padding from right edge
  );

  return (
    <div
      className="absolute z-50 flex flex-col gap-2 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50"
      style={{
        top: `${top}px`,
        left: `${menuLeft}px`,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-purple-500/20 text-gray-700 hover:text-purple-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Improve')}
        disabled={isLoading}
      >
        <Wand2 className="h-3.5 w-3.5" />
        Improve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-blue-500/20 text-gray-700 hover:text-blue-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Shorten')}
        disabled={isLoading}
      >
        <Minimize2 className="h-3.5 w-3.5" />
        Shorten
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-pink-500/20 text-gray-700 hover:text-pink-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Enhance readability of')}
        disabled={isLoading}
      >
        <BookOpen className="h-3.5 w-3.5" />
        Enhance
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-orange-500/20 text-gray-700 hover:text-orange-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Simplify')}
        disabled={isLoading}
      >
        <Scissors className="h-3.5 w-3.5" />
        Simplify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-green-500/20 text-gray-700 hover:text-green-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Lengthen')}
        disabled={isLoading}
      >
        <Maximize2 className="h-3.5 w-3.5" />
        Lengthen
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg hover:bg-indigo-500/20 text-gray-700 hover:text-indigo-700 transition-colors flex items-center gap-1.5 text-xs font-medium px-3 w-full justify-start"
        onClick={() => handleSuggestion('Fix grammar in')}
        disabled={isLoading}
      >
        <SpellCheck2 className="h-3.5 w-3.5" />
        Grammar
      </Button>
    </div>
  );
}