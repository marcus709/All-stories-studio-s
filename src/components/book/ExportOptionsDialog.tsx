import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, AlertCircle, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsDialogProps {
  documentId?: string;
  disabled?: boolean;
}

interface ValidationResult {
  platform: string;
  status: "pending" | "valid" | "invalid";
  message?: string;
}

export function ExportOptionsDialog({ documentId, disabled }: ExportOptionsDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const { toast } = useToast();

  const formats = {
    print: [
      { id: "pdf-print", name: "PDF (Print-ready)", description: "Includes embedded fonts and bleed settings" }
    ],
    digital: [
      { id: "epub", name: "EPUB", description: "Compatible with most eReaders" },
      { id: "mobi", name: "MOBI/KPF", description: "Optimized for Kindle devices" },
      { id: "html5", name: "HTML5", description: "For web-based reading platforms" }
    ]
  };

  const platforms = [
    { id: "kdp", name: "Amazon KDP" },
    { id: "ingram", name: "IngramSpark" },
    { id: "smashwords", name: "Smashwords" },
    { id: "apple", name: "Apple Books" }
  ];

  const handleExport = async () => {
    if (!selectedFormat) {
      toast({
        title: "Export Error",
        description: "Please select a format to export",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    // Simulate validation checks
    const results = platforms.map(platform => ({
      platform: platform.name,
      status: "pending" as const,
    }));
    setValidationResults(results);

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

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);

    toast({
      title: "Export Complete",
      description: `Document exported as ${selectedFormat}`,
    });
  };

  const getValidationIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return <Check className="h-4 w-4 text-green-500" />;
      case "invalid":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  return (
    <Dialog>
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="print" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="print">Print</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="print">
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {formats.print.map(format => (
                <div
                  key={format.id}
                  className={`mb-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedFormat === format.id ? "border-purple-500 bg-purple-50" : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <h3 className="font-medium">{format.name}</h3>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="digital">
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {formats.digital.map(format => (
                <div
                  key={format.id}
                  className={`mb-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedFormat === format.id ? "border-purple-500 bg-purple-50" : "hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <h3 className="font-medium">{format.name}</h3>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Compatibility Check</h3>
          <div className="space-y-2">
            {validationResults.map((result) => (
              <div key={result.platform} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{result.platform}</span>
                <div className="flex items-center gap-2">
                  {getValidationIcon(result.status)}
                  {result.message && (
                    <span className="text-sm text-red-500">{result.message}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            className="gap-2"
          >
            {isExporting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
