import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewSceneProps {
  children: React.ReactNode;
  onSceneChange: (scene: string) => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

const PREVIEW_SCENES = [
  { id: "coffee-table", name: "Coffee Table", bgClass: "bg-[url('/scenes/coffee-table.jpg')]" },
  { id: "bookshelf", name: "Bookshelf", bgClass: "bg-[url('/scenes/bookshelf.jpg')]" },
  { id: "hands", name: "In Hands", bgClass: "bg-[url('/scenes/hands.jpg')]" },
  { id: "desk", name: "Desk", bgClass: "bg-[url('/scenes/desk.jpg')]" },
  { id: "none", name: "No Background", bgClass: "bg-gray-100" },
];

export const PreviewScene = ({ 
  children, 
  onSceneChange, 
  onToggleFullscreen,
  isFullscreen,
  className 
}: PreviewSceneProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Select defaultValue="none" onValueChange={onSceneChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose background" />
          </SelectTrigger>
          <SelectContent>
            {PREVIEW_SCENES.map((scene) => (
              <SelectItem key={scene.id} value={scene.id}>
                {scene.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFullscreen}
            className="ml-2"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden transition-all duration-300">
        {children}
      </div>
    </div>
  );
};