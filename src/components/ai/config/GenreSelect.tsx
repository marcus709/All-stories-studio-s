import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenreSelect({ value, onChange }: GenreSelectProps) {
  const [customGenre, setCustomGenre] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const isCustom = value.startsWith("custom:");
  const displayValue = isCustom ? value.replace("custom:", "") : value;

  const handleCustomSave = () => {
    if (customGenre.trim()) {
      onChange(`custom:${customGenre}`);
      setIsEditing(false);
    }
  };

  const handleSelectChange = (val: string) => {
    if (val === "custom") {
      setIsEditing(true);
      setCustomGenre("");
    } else {
      onChange(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Genre</Label>
      <Select 
        value={isCustom ? "custom" : value}
        onValueChange={handleSelectChange}
        open={isEditing ? true : undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select genre">
            {isCustom ? displayValue : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">
            {isEditing ? (
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  autoFocus
                  value={customGenre}
                  onChange={(e) => setCustomGenre(e.target.value)}
                  className="w-[180px]"
                  placeholder="Enter custom genre..."
                />
                <Button 
                  size="sm"
                  onClick={handleCustomSave}
                  disabled={!customGenre.trim()}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              "Custom Genre"
            )}
          </SelectItem>
          <SelectItem value="fantasy">Fantasy</SelectItem>
          <SelectItem value="scifi">Sci-Fi</SelectItem>
          <SelectItem value="mystery">Mystery</SelectItem>
          <SelectItem value="romance">Romance</SelectItem>
          <SelectItem value="horror">Horror</SelectItem>
          <SelectItem value="historical">Historical Fiction</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}