import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PreviewSceneProps {
  children: React.ReactNode;
  onSceneChange: (scene: string) => void;
  className?: string;
}

const PREVIEW_SCENES = [
  { id: "coffee-table", name: "Coffee Table", bgClass: "bg-[url('/scenes/coffee-table.jpg')]" },
  { id: "bookshelf", name: "Bookshelf", bgClass: "bg-[url('/scenes/bookshelf.jpg')]" },
  { id: "hands", name: "In Hands", bgClass: "bg-[url('/scenes/hands.jpg')]" },
  { id: "desk", name: "Desk", bgClass: "bg-[url('/scenes/desk.jpg')]" },
  { id: "none", name: "No Background", bgClass: "bg-gray-100" },
];

export const PreviewScene = ({ children, onSceneChange, className }: PreviewSceneProps) => {
  return (
    <div className={cn("space-y-4", className)}>
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

      <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden transition-all duration-300">
        {children}
      </div>
    </div>
  );
};