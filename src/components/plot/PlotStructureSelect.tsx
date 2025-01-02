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
    <div className="mb-6">
      <Select
        value={selectedStructure || ""}
        onValueChange={(value) => onStructureChange(value)}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a plot structure" />
        </SelectTrigger>
        <SelectContent>
          {plotStructures?.map((structure) => (
            <SelectItem key={structure.id} value={structure.id}>
              {structure.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};