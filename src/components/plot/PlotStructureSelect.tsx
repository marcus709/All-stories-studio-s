import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlotStructure } from "./types";

interface PlotStructureSelectProps {
  plotStructures?: PlotStructure[];
  selectedStructure: string | null;
  onStructureChange: (value: string) => void;
}

export const PlotStructureSelect = ({
  plotStructures,
  selectedStructure,
  onStructureChange,
}: PlotStructureSelectProps) => {
  return (
    <Select
      value={selectedStructure || ""}
      onValueChange={(value) => onStructureChange(value)}
    >
      <SelectTrigger className="w-full border-violet-200 focus:ring-violet-500">
        <SelectValue placeholder="Select plot structure" />
      </SelectTrigger>
      <SelectContent>
        {plotStructures?.map((structure) => (
          <SelectItem key={structure.id} value={structure.id}>
            {structure.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};