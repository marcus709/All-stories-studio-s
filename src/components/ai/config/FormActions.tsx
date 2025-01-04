import { Button } from "@/components/ui/button";

interface FormActionsProps {
  loading: boolean;
  onClose: () => void;
}

export function FormActions({ loading, onClose }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Configuration"}
      </Button>
    </div>
  );
}