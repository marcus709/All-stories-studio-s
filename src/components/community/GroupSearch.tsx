import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GroupSearchProps {
  onSearch: (query: string) => void;
}

export const GroupSearch = ({ onSearch }: GroupSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        className="pl-10"
        placeholder="Search groups..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};