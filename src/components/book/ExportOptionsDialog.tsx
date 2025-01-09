import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, AlertCircle, Check, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExportOptionsDialogProps {
  documentId?: string;
  disabled?: boolean;
}

interface ValidationResult {
  platform: string;
  status: "pending" | "valid" | "invalid";
  message?: string;
}

const platforms = [
  { name: "Kindle", format: "mobi" },
  { name: "Apple Books", format: "epub" },
  { name: "PDF", format: "pdf" },
];

export function ExportOptionsDialog({ documentId, disabled }: ExportOptionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const { toast } = useToast();

  const handleExport = async () => {
    if (disabled) {
      toast({
        title: "Export not available",
        description: "Please format your document first before exporting",
        variant: "destructive",
      });
      return;
    }

    if (!documentId) {
      toast({
        title: "Export Error",
        description: "No document selected for export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setDownloadUrl(null);
    
    // Initialize validation results
    setValidationResults(platforms.map(p => ({
      platform: p.name,
      status: "pending"
    })));

    try {
      // Simulate validation process
      for (let i = 0; i < platforms.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setValidationResults(prev => [
          ...prev.slice(0, i),
          {
            platform: platforms[i].name,
            status: Math.random() > 0.2 ? "valid" : "invalid",
            message: Math.random() > 0.2 ? undefined : "Some formatting issues detected"
          },
          ...prev.slice(i + 1)
        ]);
      }

      // Call the formatting edge function
      const { data, error } = await supabase.functions.invoke('format-document', {
        body: { 
          documentId,
          format: 'pdf' // Default format for now
        }
      });

      if (error) {
        console.error('Export error:', error);
        throw new Error(error.message || 'Failed to export document');
      }

      if (!data?.downloadUrl) {
        throw new Error('No download URL received from the server');
      }

      // Set the download URL from the response
      setDownloadUrl(data.downloadUrl);
      
      toast({
        title: "Export successful",
        description: "Your document has been exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export document",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={disabled}
        >
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {platforms.map((platform, index) => (
            <div key={platform.name} className="flex items-center justify-between">
              <span>{platform.name}</span>
              <div className="flex items-center gap-2">
                {validationResults[index]?.status === "pending" && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                )}
                {validationResults[index]?.status === "valid" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {validationResults[index]?.status === "invalid" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}

          {validationResults.some(r => r.status === "invalid") && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some formatting issues were detected. Please review and fix them before exporting.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            {downloadUrl ? (
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            ) : (
              <Button 
                onClick={handleExport}
                disabled={isExporting || disabled}
                className="gap-2"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    Start Export
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}