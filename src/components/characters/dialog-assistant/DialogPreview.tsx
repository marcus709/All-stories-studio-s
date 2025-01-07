import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogPreviewProps {
  generatedDialog: string;
  isSaving: boolean;
  onSave: () => void;
}

export function DialogPreview({ generatedDialog, isSaving, onSave }: DialogPreviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Generated Dialog</h2>
      {generatedDialog ? (
        <>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-[300px] max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm">{generatedDialog}</pre>
          </div>
          <Button
            onClick={onSave}
            disabled={isSaving}
            variant="outline"
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving to Documents...
              </>
            ) : (
              "Save as New Document"
            )}
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          Generated dialog will appear here
        </div>
      )}
    </div>
  );
}