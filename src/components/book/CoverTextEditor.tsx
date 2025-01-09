import { useEffect, useRef } from "react";
import { Canvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

const FONT_SIZES = Array.from({ length: 20 }, (_, i) => (i + 1) * 4);

export const CoverTextEditor = ({ width, height, onTextUpdate }: CoverTextEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricRef.current = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "transparent",
    });

    const canvas = fabricRef.current;

    // Enable text editing
    canvas.on("text:changed", () => {
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
      fill: "black",
    });

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    updateTextData();

    toast({
      title: "Text added",
      description: "Click and drag to move, double click to edit",
    });
  };

  const updateSelectedText = (property: string, value: string | number) => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject || !(activeObject instanceof IText)) return;

    switch (property) {
      case "font":
        activeObject.set("fontFamily", value);
        break;
      case "size":
        activeObject.set("fontSize", Number(value));
        break;
    }

    fabricRef.current.renderAll();
    updateTextData();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select onValueChange={(value) => updateSelectedText("font", value)}>
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
          <Select onValueChange={(value) => updateSelectedText("size", value)}>
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

        <Button onClick={addNewText}>Add Text</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};