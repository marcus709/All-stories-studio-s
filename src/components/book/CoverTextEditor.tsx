import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverTextEditorProps {
  width: number;
  height: number;
  onTextUpdate: (texts: { text: string; font: string; size: number; x: number; y: number }[]) => void;
  onTextSelect?: (selectedText: IText | null) => void;
}

export const CoverTextEditor = ({ width, height, onTextUpdate, onTextSelect }: CoverTextEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { toast } = useToast();
  const [selectedObject, setSelectedObject] = useState<IText | null>(null);

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
        onTextSelect?.(selected);
      }
    });

    canvas.on("selection:cleared", () => {
      setSelectedObject(null);
      onTextSelect?.(null);
    });

    canvas.on("text:changed", () => {
      updateTextData();
    });

    canvas.on("object:modified", () => {
      updateTextData();
    });

    // Add initial helper text
    const helperText = new IText("Click 'Add Text' to start editing", {
      left: width / 2,
      top: height / 2,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#666666",
      originX: "center",
      originY: "center",
      selectable: false,
    });
    canvas.add(helperText);

    return () => {
      canvas.dispose();
    };
  }, [width, height, onTextSelect]);

  const updateTextData = () => {
    if (!fabricRef.current) return;
    
    const texts = fabricRef.current.getObjects("i-text")
      .filter((obj): obj is IText => obj instanceof IText && obj.selectable !== false)
      .map((textObj) => ({
        text: textObj.text || "",
        font: textObj.fontFamily || "Arial",
        size: textObj.fontSize || 20,
        x: textObj.left || 0,
        y: textObj.top || 0,
      }));

    onTextUpdate(texts);
  };

  const addNewText = (style: string = "normal") => {
    if (!fabricRef.current) return;

    // Remove helper text if it exists
    const helperText = fabricRef.current.getObjects().find(
      (obj): obj is IText => 
        obj instanceof IText && 
        obj.selectable === false
    );
    if (helperText) {
      fabricRef.current.remove(helperText);
    }

    let textConfig: any = {
      left: 50,
      top: 50,
      fontFamily: "Arial",
      fontSize: 20,
      fill: "#000000",
      text: "Your Text Here",
    };

    // Apply style-specific configurations
    switch (style) {
      case "h1":
        textConfig = {
          ...textConfig,
          fontSize: 32,
          fontWeight: "bold",
          text: "Header 1"
        };
        break;
      case "h2":
        textConfig = {
          ...textConfig,
          fontSize: 24,
          fontWeight: "bold",
          text: "Header 2"
        };
        break;
      case "footer":
        textConfig = {
          ...textConfig,
          fontSize: 12,
          top: height - 50,
          text: "Footer Text"
        };
        break;
      case "page-number":
        textConfig = {
          ...textConfig,
          fontSize: 12,
          top: height - 30,
          left: width - 50,
          text: "1"
        };
        break;
    }

    const text = new IText(textConfig.text, textConfig);

    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
    setSelectedObject(text);
    onTextSelect?.(text);
    updateTextData();

    toast({
      title: "Text added",
      description: "Double click to edit, drag to move",
    });
  };

  return (
    <div className="relative w-full h-full">
      <div className="border rounded-lg overflow-hidden bg-white h-full">
        <canvas ref={canvasRef} />
      </div>

      <div className="absolute top-4 right-4">
        <Button 
          onClick={() => addNewText()} 
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Text
        </Button>
      </div>

      {!selectedObject && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-lg">Click 'Add Text' to start editing</p>
        </div>
      )}
    </div>
  );
};