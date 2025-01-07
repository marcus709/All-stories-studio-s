import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TimelineNodeFieldsProps {
  isEditing: boolean;
  editedLabel: string;
  editedSubtitle: string;
  editedYear: string;
  setEditedLabel: (value: string) => void;
  setEditedSubtitle: (value: string) => void;
  setEditedYear: (value: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleDoubleClick: (e: React.MouseEvent) => void;
  data: {
    label: string;
    subtitle: string;
    year: string;
  };
}

export const TimelineNodeFields = ({
  isEditing,
  editedLabel,
  editedSubtitle,
  editedYear,
  setEditedLabel,
  setEditedSubtitle,
  setEditedYear,
  handleSave,
  handleCancel,
  handleDoubleClick,
  data,
}: TimelineNodeFieldsProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 w-full" onClick={(e) => e.stopPropagation()}>
        <Input
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          placeholder="Event title"
          className="font-medium"
          autoFocus
        />
        <Textarea
          value={editedSubtitle}
          onChange={(e) => setEditedSubtitle(e.target.value)}
          placeholder="Event description"
          className="text-sm resize-none"
          rows={2}
        />
        <Input
          type="text"
          value={editedYear}
          onChange={(e) => setEditedYear(e.target.value)}
          placeholder="Year/Time period"
          className="text-sm"
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="w-full cursor-pointer">
      <h3 className="font-medium text-gray-900">{data.label}</h3>
      <p className="text-sm text-gray-500 mt-1">{data.subtitle}</p>
      <p className="text-xs text-gray-400 mt-2">{data.year}</p>
    </div>
  );
};