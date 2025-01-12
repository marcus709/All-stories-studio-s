import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  X, 
  Smartphone, 
  Tablet, 
  Book, 
  Monitor,
  PanelRightClose,
  PanelRightOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOK_SIZES, DIGITAL_FORMATS, FORMAT_SIZES, BookSize } from "@/lib/formatting-constants";
import { getPreviewStyles } from "@/lib/preview-constants";
import { useToast } from "@/hooks/use-toast";
import { WYSIWYGEditor } from './WYSIWYGEditor';

interface TextFormattingToolsProps {
  isAIMode: boolean;
  currentSection: string;
  sectionContent?: string;
  onContentChange: (content: string) => void;
  onBookSizeChange: (size: BookSize) => void;
  onDeviceSettingsChange: (settings: any) => void;
}

// Helper function to get the appropriate icon for each device type
const getDeviceIcon = (deviceType: string) => {
  switch (deviceType) {
    case 'print':
      return <Book className="h-4 w-4" />;
    case 'kindle':
      return <Monitor className="h-4 w-4" />;
    case 'ipad':
      return <Tablet className="h-4 w-4" />;
    case 'phone':
      return <Smartphone className="h-4 w-4" />;
    default:
      return <Book className="h-4 w-4" />;
  }
};

export const TextFormattingTools = ({ 
  isAIMode, 
  currentSection,
  sectionContent,
  onContentChange,
  onBookSizeChange,
  onDeviceSettingsChange
}: TextFormattingToolsProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'kdp' | 'ingramSpark'>('kdp');
  const [selectedFormat, setSelectedFormat] = useState<'print' | 'digital'>('print');
  const [selectedSize, setSelectedSize] = useState<string>('6x9');
  const [deviceView, setDeviceView] = useState<'print' | 'kindle' | 'ipad' | 'phone'>('print');
  const [fontSize, setFontSize] = useState<string>("12pt");
  const [isFormatSettingsOpen, setIsFormatSettingsOpen] = useState(true);
  const [editableContent, setEditableContent] = useState(sectionContent || '');
  const [showPlatformAlert, setShowPlatformAlert] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setEditableContent(sectionContent || '');
  }, [sectionContent]);

  const handlePlatformChange = (platform: 'kdp' | 'ingramSpark') => {
    setSelectedPlatform(platform);
    setSelectedFormat('print');
    setSelectedSize(platform === 'kdp' ? '6x9' : '5x8');
    
    toast({
      title: `${platform === 'kdp' ? 'Amazon KDP' : 'IngramSpark'} Selected`,
      description: platform === 'kdp' 
        ? "Using Amazon KDP specifications for formatting"
        : "Using IngramSpark specifications for formatting",
    });
  };

  const handleFormatChange = (format: 'print' | 'digital') => {
    setSelectedFormat(format);
    if (format === 'digital') {
      setDeviceView('kindle');
    } else {
      setDeviceView('print');
      setSelectedSize('6x9');
    }
  };

  const deviceStyles = getPreviewStyles(selectedPlatform, selectedFormat, selectedSize, deviceView);

  const getDocumentStyle = (): React.CSSProperties => {
    const selectedSizeObj = BOOK_SIZES.find(size => size.name === selectedSize);
    return {
      padding: '1rem',
      fontSize: fontSize,
      lineHeight: '1.6',
      fontFamily: '"Times New Roman", serif',
      color: '#1a1a1a',
      textAlign: 'left' as const,
      width: selectedSizeObj ? `${selectedSizeObj.width * 96}px` : '100%',
      height: selectedSizeObj ? `${selectedSizeObj.height * 96}px` : 'auto',
      minHeight: '90vh',
      maxWidth: '100%',
      backgroundColor: '#ffffff',
      margin: '0 auto',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease-in-out',
      position: 'relative' as const,
      overflow: 'hidden',
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      overflowX: 'hidden',
    };
  };

  return (
    <div className="flex-1 flex">
      <div className={cn(
        "w-[50%] mx-auto my-4 overflow-hidden transition-all duration-300",
        isSidebarOpen ? "mr-[350px]" : "mr-4"
      )}>
        <div className="flex items-center justify-end mb-4 bg-gray-50 p-2 rounded-lg">
          <Button
            variant="outline"
            size="default"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <>
                <PanelRightClose className="h-5 w-5" />
                <span>Hide Settings</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="h-5 w-5" />
                <span>Show Settings</span>
              </>
            )}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {showPlatformAlert && (
            <Alert className="mb-4 relative">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {selectedPlatform === 'kdp' 
                  ? "Amazon KDP requires specific trim sizes and bleed settings. Preview shows safe areas and bleed zones."
                  : "IngramSpark offers more flexibility but requires higher quality PDF submissions with proper bleed settings."}
              </AlertDescription>
              <button 
                onClick={() => setShowPlatformAlert(false)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </Alert>
          )}

          <div className={cn(
            "relative mx-auto transition-all duration-300",
            "rounded-lg overflow-hidden"
          )}>
            <div style={getDocumentStyle()} className="relative">
              <WYSIWYGEditor
                content={editableContent}
                onChange={(content) => {
                  setEditableContent(content);
                  onContentChange(content);
                }}
                style={getDocumentStyle()}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className={cn(
        "fixed right-0 top-0 h-full bg-white border-l w-[350px] transition-all duration-300 z-40",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Document Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)] p-4">
          <div className="space-y-6">
            <Collapsible
              open={isFormatSettingsOpen}
              onOpenChange={setIsFormatSettingsOpen}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Publishing Platform</label>
                  <Select 
                    value={selectedPlatform}
                    onValueChange={(value: 'kdp' | 'ingramSpark') => handlePlatformChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kdp">Amazon KDP</SelectItem>
                      <SelectItem value="ingramSpark">IngramSpark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Preview Device</label>
                  <Select value={deviceView} onValueChange={(value: 'print' | 'kindle' | 'ipad' | 'phone') => {
                    setDeviceView(value);
                    if (value !== 'print') {
                      setSelectedFormat('digital');
                    } else {
                      setSelectedFormat('print');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(deviceView)}
                          <span>
                            {deviceView === 'print' ? 'Print Preview' :
                             deviceView === 'kindle' ? 'Kindle E-reader' :
                             deviceView === 'ipad' ? 'iPad/Tablet' :
                             'Phone'}
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="print">
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4" />
                          <span>Print Preview</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="kindle">
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4" />
                          <span>Kindle E-reader</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ipad">
                        <div className="flex items-center gap-2">
                          <Tablet className="h-4 w-4" />
                          <span>iPad/Tablet</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="phone">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>Phone</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Format Type</label>
                  <Select 
                    value={selectedFormat}
                    onValueChange={(value: 'print' | 'digital') => handleFormatChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="print">Print Book</SelectItem>
                      {selectedPlatform === 'kdp' && (
                        <SelectItem value="digital">Digital (Kindle)</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedFormat === 'print' && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Trim Size</label>
                    <Select 
                      value={selectedSize} 
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedPlatform === 'kdp' ? (
                          <>
                            <SelectItem value="5x8">5" x 8" (Novel)</SelectItem>
                            <SelectItem value="6x9">6" x 9" (Standard)</SelectItem>
                            <SelectItem value="8.5x11">8.5" x 11" (Textbook)</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="5x8">5" x 8" (Novel)</SelectItem>
                            <SelectItem value="6x9">6" x 9" (Standard)</SelectItem>
                            <SelectItem value="8.5x8.5">8.5" x 8.5" (Square)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsFormatSettingsOpen(false);
                      onDeviceSettingsChange({
                        platform: selectedPlatform,
                        format: selectedFormat,
                        size: selectedSize,
                        deviceView,
                        fontSize
                      });
                    }}
                  >
                    Save Format Settings
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Insights
                  </Button>
                </div>
              </div>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
