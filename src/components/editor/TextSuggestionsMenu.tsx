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
  editor: Editor;
  isOpen: boolean;
  top: number;
  left: number;
}

export function TextSuggestionsMenu({ editor, isOpen, top, left }: TextSuggestionsMenuProps) {
  const { generateContent, isLoading } = useAI();
  const { toast } = useToast();

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

  const buttons = [
    {
      label: 'Improve',
      icon: Wand2,
      color: 'from-purple-500 to-purple-600',
      onClick: () => handleSuggestion('Improve')
    },
    {
      label: 'Enhance',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      onClick: () => handleSuggestion('Enhance readability of')
    },
    {
      label: 'Shorten',
      icon: Minimize2,
      color: 'from-pink-500 to-pink-600',
      onClick: () => handleSuggestion('Shorten')
    },
    {
      label: 'Simplify',
      icon: Scissors,
      color: 'from-orange-500 to-orange-600',
      onClick: () => handleSuggestion('Simplify')
    },
    {
      label: 'Lengthen',
      icon: Maximize2,
      color: 'from-green-500 to-green-600',
      onClick: () => handleSuggestion('Lengthen')
    },
    {
      label: 'Grammar',
      icon: SpellCheck2,
      color: 'from-indigo-500 to-indigo-600',
      onClick: () => handleSuggestion('Fix grammar in')
    }
  ];

  return (
    <div
      className="absolute z-50 flex flex-wrap gap-1.5 p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: '400px',
      }}
    >
      {buttons.map((button) => (
        <Button
          key={button.label}
          variant="ghost"
          size="sm"
          className={`h-7 px-2.5 rounded-full bg-gradient-to-r ${button.color} hover:opacity-90 text-white transition-all flex items-center gap-1 text-xs font-medium`}
          onClick={button.onClick}
          disabled={isLoading}
        >
          <button.icon className="h-3 w-3" />
          {button.label}
        </Button>
      ))}
    </div>
  );
}