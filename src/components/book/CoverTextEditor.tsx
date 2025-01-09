import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline,
  Type
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";

interface CoverTextEditorProps {
  width: number;
  height: number;
  onTextUpdate: (texts: { text: string; font: string; size: number; x: number; y: number }[]) => void;
}

const FONTS = [
  { name: "Arial", value: "Arial" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Helvetica", value: "Helvetica" },
  { name: "Georgia", value: "Georgia" },
  { name: "Courier New", value: "Courier New" }
];

const FONT_SIZES = Array.from({ length: 72 }, (_, i) => i + 8); // 8px to 80px

export const CoverTextEditor = ({ width, height, onTextUpdate }: CoverTextEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { toast } = useToast();
  const [selectedObject, setSelectedObject] = useState<IText | null>(null);
  const [textColor, setTextColor] = useState("#000000");

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricRef.current = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
    });

    const canvas = fabricRef.current;

    canvas.on("selection:created", (e) => {
      const selected = e.selected?.[0];
      if (selected instanceof IText) {
        setSelectedObject(selected);
        setTextColor(selected.fill as string || "#000000");
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    canvas.on("text:changed", () => {
      updateTextData();
    });

    canvas.on("object:modified", () => {
      updateTextData();
    });

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  const updateTextData = () => {
    if (!fabricRef.current) return;
    
    const texts = fabricRef.current.getObjects("i-text").map((obj) => {
      const textObj = obj as IText;
      return {
        text: textObj.text || "",
        font: textObj.fontFamily || "Arial",
        size: textObj.fontSize || 20,
        x: textObj.left || 0,
        y: textObj.top || 0,
      };
    });

    onTextUpdate(texts);
  };

  const addNewText = () => {
    if (!fabricRef.current) return;

    const text = new IText("Your Text Here", {
      left: 50,
      top: 50,
      fontFamily: "Arial",
      fontSize: 20,
      fill: textColor,
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    setSelectedObject(text);
    updateTextData();

    toast({
      title: "Text added",
      description: "Click and drag to move, double click to edit",
    });
  };

  const updateSelectedText = (property: string, value: string | number) => {
    if (!selectedObject) return;

    switch (property) {
      case "font":
        selectedObject.set("fontFamily", value);
        break;
      case "size":
        selectedObject.set("fontSize", Number(value));
        break;
      case "color":
        selectedObject.set("fill", value);
        setTextColor(value as string);
        break;
      case "align":
        selectedObject.set("textAlign", value);
        break;
      case "bold":
        selectedObject.set("fontWeight", selectedObject.fontWeight === "bold" ? "normal" : "bold");
        break;
      case "italic":
        selectedObject.set("fontStyle", selectedObject.fontStyle === "italic" ? "normal" : "italic");
        break;
      case "underline":
        selectedObject.set("underline", !selectedObject.underline);
        break;
    }

    fabricRef.current?.renderAll();
    updateTextData();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select 
            value={selectedObject?.fontFamily || undefined}
            onValueChange={(value) => updateSelectedText("font", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Font Size</Label>
          <Select 
            value={selectedObject?.fontSize?.toString() || undefined}
            onValueChange={(value) => updateSelectedText("size", value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Text Color</Label>
          <Input
            type="color"
            value={textColor}
            onChange={(e) => updateSelectedText("color", e.target.value)}
            className="w-[100px] h-10"
          />
        </div>

        <ToggleGroup type="single" className="flex gap-1">
          <ToggleGroupItem value="left" onClick={() => updateSelectedText("align", "left")}>
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" onClick={() => updateSelectedText("align", "center")}>
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" onClick={() => updateSelectedText("align", "right")}>
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup type="multiple" className="flex gap-1">
          <ToggleGroupItem 
            value="bold" 
            onClick={() => updateSelectedText("bold", "")}
            data-state={selectedObject?.fontWeight === "bold" ? "on" : "off"}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            onClick={() => updateSelectedText("italic", "")}
            data-state={selectedObject?.fontStyle === "italic" ? "on" : "off"}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="underline" 
            onClick={() => updateSelectedText("underline", "")}
            data-state={selectedObject?.underline ? "on" : "off"}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button onClick={addNewText} className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Add Text
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};