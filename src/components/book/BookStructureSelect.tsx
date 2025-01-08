import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookStructureSelectProps {
  bookStructures?: any[];
  selectedStructure: string | null;
  onStructureChange: (value: string) => void;
}

export const BookStructureSelect = ({
  bookStructures,
  selectedStructure,
  onStructureChange,
}: BookStructureSelectProps) => {
  return (
    <Select
      value={selectedStructure || ""}
      onValueChange={(value) => onStructureChange(value)}
    >
      <SelectTrigger className="w-full border-violet-200 focus:ring-violet-500">
        <SelectValue placeholder="Select book structure" />
      </SelectTrigger>
      <SelectContent>
        {bookStructures?.map((structure) => (
          <SelectItem key={structure.id} value={structure.id}>
            {structure.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};