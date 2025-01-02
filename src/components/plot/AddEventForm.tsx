import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddEventFormProps {
  newEvent: {
    title: string;
    description: string;
  };
  onEventChange: (event: { title: string; description: string }) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddEventForm = ({
  newEvent,
  onEventChange,
  onCancel,
  onSubmit,
}: AddEventFormProps) => {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Event title"
        value={newEvent.title}
        onChange={(e) =>
          onEventChange({ ...newEvent, title: e.target.value })
        }
      />
      <Textarea
        placeholder="Event description"
        value={newEvent.description}
        onChange={(e) =>
          onEventChange({ ...newEvent, description: e.target.value })
        }
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Add Event</Button>
      </div>
    </div>
  );
};