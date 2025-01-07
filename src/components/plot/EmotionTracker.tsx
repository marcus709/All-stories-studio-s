import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentUpload } from "@/components/story-logic/DocumentUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface EmotionData {
  stage: string;
  characterEmotion: number;
  readerEmotion: number;
}

interface EmotionTrackerProps {
  plotEvents: any[];
  selectedDocument: string | null;
  onDocumentSelect: (id: string) => void;
}

export const EmotionTracker = ({ plotEvents, selectedDocument, onDocumentSelect }: EmotionTrackerProps) => {
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const { toast } = useToast();

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: emotions } = useQuery({
    queryKey: ["plotEmotions", selectedDocument],
    queryFn: async () => {
      if (!selectedDocument) return null;
      
      const { data, error } = await supabase
        .from("plot_emotions")
        .select("*")
        .eq("document_id", selectedDocument);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDocument,
  });

  const emotionData: EmotionData[] = plotEvents.map((event) => {
    const eventEmotion = emotions?.find((e) => e.plot_event_id === event.id);
    return {
      stage: event.stage,
      characterEmotion: eventEmotion?.intensity || 0,
      readerEmotion: eventEmotion?.intensity || 0,
    };
  });

  const handleUploadComplete = () => {
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
    setShowDocumentSelector(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Emotional Arc</h3>
        <Dialog open={showDocumentSelector} onOpenChange={setShowDocumentSelector}>
          <DialogTrigger asChild>
            <Button variant="outline">Select Document</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select or Upload Document for Analysis</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">Existing Documents</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>
              <TabsContent value="existing">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {documents?.map((doc) => (
                      <Button
                        key={doc.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          onDocumentSelect(doc.id);
                          setShowDocumentSelector(false);
                        }}
                      >
                        {doc.title}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="upload">
                <DocumentUpload 
                  storyId={selectedDocument || ''} 
                  onUploadComplete={handleUploadComplete}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full aspect-[2/1] min-h-[400px] bg-violet-50/50 rounded-lg p-4">
        {selectedDocument ? (
          <LineChart
            width={800}
            height={400}
            data={emotionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            className="mx-auto"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="stage" 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="characterEmotion" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Character Emotion"
              dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="readerEmotion" 
              stroke="#ec4899" 
              strokeWidth={2}
              name="Reader Emotion"
              dot={{ stroke: '#ec4899', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a document to view emotional analysis
          </div>
        )}
      </div>
    </div>
  );
};