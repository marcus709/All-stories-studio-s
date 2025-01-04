import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface GenreSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenreSelect({ value, onChange }: GenreSelectProps) {
  const [customGenre, setCustomGenre] = useState("");
  const isCustom = value === "custom";

  // Update parent only when user stops typing
  useEffect(() => {
    if (isCustom && customGenre) {
      const timeoutId = setTimeout(() => {
        onChange(customGenre);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [customGenre, isCustom, onChange]);

  return (
    <div className="space-y-2">
      <Label>Genre</Label>
      <Select 
        value={isCustom ? "custom" : value} 
        onValueChange={(val) => {
          if (val !== "custom") {
            setCustomGenre("");
            onChange(val);
          } else {
            onChange("custom");
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom Genre</SelectItem>
          <SelectItem value="fantasy">Fantasy</SelectItem>
          <SelectItem value="scifi">Sci-Fi</SelectItem>
          <SelectItem value="mystery">Mystery</SelectItem>
          <SelectItem value="romance">Romance</SelectItem>
          <SelectItem value="horror">Horror</SelectItem>
          <SelectItem value="historical">Historical Fiction</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <Input
          placeholder="Enter custom genre"
          value={customGenre}
          onChange={(e) => setCustomGenre(e.target.value)}
          className="mt-2"
        />
      )}
    </div>
  );
}