import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  BookText,
  Wand2
} from "lucide-react";

interface FormattingItem {
  id: string;
  type: 'block' | 'inline' | 'list';
  icon: React.ReactNode;
  label: string;
}

const formattingItems: FormattingItem[] = [
  { id: 'heading1', type: 'block', icon: <Heading1 className="h-4 w-4" />, label: 'Heading 1' },
  { id: 'heading2', type: 'block', icon: <Heading2 className="h-4 w-4" />, label: 'Heading 2' },
  { id: 'quote', type: 'block', icon: <Quote className="h-4 w-4" />, label: 'Quote' },
  { id: 'list', type: 'list', icon: <List className="h-4 w-4" />, label: 'Bullet List' },
  { id: 'ordered-list', type: 'list', icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List' },
  { id: 'footnote', type: 'inline', icon: <BookText className="h-4 w-4" />, label: 'Footnote' }
];

const alignmentTools = [
  { id: 'align-left', icon: <AlignLeft className="h-4 w-4" />, label: 'Align Left' },
  { id: 'align-center', icon: <AlignCenter className="h-4 w-4" />, label: 'Align Center' },
  { id: 'align-right', icon: <AlignRight className="h-4 w-4" />, label: 'Align Right' },
];

const styleTools = [
  { id: 'bold', icon: <Bold className="h-4 w-4" />, label: 'Bold' },
  { id: 'italic', icon: <Italic className="h-4 w-4" />, label: 'Italic' },
  { id: 'underline', icon: <Underline className="h-4 w-4" />, label: 'Underline' },
];

interface TextFormattingToolsProps {
  isAIMode?: boolean;
}

export const TextFormattingTools = ({ isAIMode = false }: TextFormattingToolsProps) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  if (isAIMode) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          AI Formatting Assistant
        </h3>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-700 mb-4">
            Let AI help you format your text. Just describe what you want, and I'll help you achieve it.
          </p>
          <textarea
            className="w-full h-32 p-3 rounded-md border border-purple-200 bg-white/80 text-sm"
            placeholder="Describe how you want to format your text..."
          />
          <Button className="w-full mt-3 bg-purple-500 hover:bg-purple-600">
            Apply AI Formatting
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Text Elements</h3>
        <div className="grid grid-cols-2 gap-2">
          {formattingItems.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className={`flex items-center gap-2 justify-start ${
                selectedTool === item.id ? 'border-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => setSelectedTool(item.id)}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Alignment</h3>
        <div className="flex gap-2">
          {alignmentTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              className={`flex-1 ${
                selectedTool === tool.id ? 'border-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Style</h3>
        <div className="flex gap-2">
          {styleTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              className={`flex-1 ${
                selectedTool === tool.id ? 'border-purple-500 bg-purple-50' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};