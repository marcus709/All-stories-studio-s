import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Type, 
  Heading1, 
  Heading2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Baseline,
  Quote,
  List,
  ListOrdered,
  Footnotes
} from "lucide-react";

interface FormattingItem {
  id: string;
  type: string;
  icon: React.ReactNode;
  label: string;
}

const formattingItems: FormattingItem[] = [
  { id: 'text', type: 'normal', icon: <Type className="h-4 w-4" />, label: 'Normal Text' },
  { id: 'h1', type: 'heading', icon: <Heading1 className="h-4 w-4" />, label: 'Heading 1' },
  { id: 'h2', type: 'heading', icon: <Heading2 className="h-4 w-4" />, label: 'Heading 2' },
  { id: 'quote', type: 'block', icon: <Quote className="h-4 w-4" />, label: 'Quote' },
  { id: 'list', type: 'list', icon: <List className="h-4 w-4" />, label: 'Bullet List' },
  { id: 'ordered-list', type: 'list', icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List' },
  { id: 'footnote', type: 'inline', icon: <Footnotes className="h-4 w-4" />, label: 'Footnote' }
];

const alignmentTools = [
  { id: 'align-left', icon: <AlignLeft className="h-4 w-4" />, label: 'Left' },
  { id: 'align-center', icon: <AlignCenter className="h-4 w-4" />, label: 'Center' },
  { id: 'align-right', icon: <AlignRight className="h-4 w-4" />, label: 'Right' }
];

const styleTools = [
  { id: 'bold', icon: <Bold className="h-4 w-4" />, label: 'Bold' },
  { id: 'italic', icon: <Italic className="h-4 w-4" />, label: 'Italic' },
  { id: 'underline', icon: <Underline className="h-4 w-4" />, label: 'Underline' }
];

export const TextFormattingTools = () => {
  const [draggingItem, setDraggingItem] = useState<FormattingItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: FormattingItem) => {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium">Text Elements</Label>
        <div className="grid grid-cols-2 gap-2">
          {formattingItems.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="flex items-center gap-2 p-2 bg-white/60 rounded-md border border-gray-200/60 cursor-move hover:bg-gray-50/60 transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Text Alignment</Label>
        <div className="flex gap-2">
          {alignmentTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="icon"
              className="bg-white/60"
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Text Style</Label>
        <div className="flex gap-2">
          {styleTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="icon"
              className="bg-white/60"
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/40 rounded-md border border-dashed border-gray-300/60">
        <div className="flex items-center justify-center">
          <Baseline className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Drag elements to add them to your book</span>
        </div>
      </div>
    </div>
  );
};