import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, AlertCircle, Check, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DIGITAL_FORMATS } from "@/lib/formatting-constants";

interface ExportOptionsDialogProps {
  documentId?: string;
  disabled?: boolean;
  bookSize?: { width: number; height: number; name: string } | null;
  deviceSettings?: any;
}

interface ValidationResult {
  platform: string;
  status: "pending" | "valid" | "invalid";
  message?: string;
}

export function ExportOptionsDialog({ 
  documentId, 
  disabled,
  bookSize,
  deviceSettings 
}: ExportOptionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [selectedFormat, setSelectedFormat] = useState(DIGITAL_FORMATS[0].name.toLowerCase());
  const { toast } = useToast();

  const handleExport = async () => {
    if (!documentId || !bookSize) {
      toast({
        title: "Export Error",
        description: "Please select a document and book size before exporting",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setDownloadUrl(null);
    
    // Initialize validation results
    setValidationResults(DIGITAL_FORMATS.map(p => ({
      platform: p.name,
      status: "pending"
    })));

    try {
      // Fetch the document content
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('content')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Call the formatting edge function
      const { data, error } = await supabase.functions.invoke('format-document', {
        body: { 
          documentId,
          format: selectedFormat,
          bookSize,
          deviceSettings,
          content: document.content
        }
      });

      if (error) throw error;

      if (!data?.downloadUrl) {
        throw new Error('No download URL received from the server');
      }

      setDownloadUrl(data.downloadUrl);
      
      // Update validation results to show success
      setValidationResults(prev => 
        prev.map(result => ({
          ...result,
          status: "valid"
        }))
      );

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

      // Update validation results to show failure
      setValidationResults(prev => 
        prev.map(result => ({
          ...result,
          status: "invalid",
          message: "Export failed"
        }))
      );
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select
              value={selectedFormat}
              onValueChange={setSelectedFormat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {DIGITAL_FORMATS.map((format) => (
                  <SelectItem 
                    key={format.name.toLowerCase()} 
                    value={format.name.toLowerCase()}
                  >
                    {format.name} ({format.extension})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {validationResults.map((result) => (
            <div key={result.platform} className="flex items-center justify-between">
              <span>{result.platform}</span>
              <div className="flex items-center gap-2">
                {result.status === "pending" && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                )}
                {result.status === "valid" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {result.status === "invalid" && (
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
                disabled={isExporting || disabled || !bookSize}
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