import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Emotional Arc</h3>
        <Dialog open={showDocumentSelector} onOpenChange={setShowDocumentSelector}>
          <DialogTrigger asChild>
            <Button variant="outline">Select Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Document for Analysis</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full h-64 bg-violet-50/50 rounded-lg p-4">
        <LineChart
          width={800}
          height={200}
          data={emotionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="characterEmotion" 
            stroke="#8b5cf6" 
            name="Character Emotion"
          />
          <Line 
            type="monotone" 
            dataKey="readerEmotion" 
            stroke="#ec4899" 
            name="Reader Emotion"
          />
        </LineChart>
      </div>
    </div>
  );
};