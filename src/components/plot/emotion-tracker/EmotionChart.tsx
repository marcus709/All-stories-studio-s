import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Loader2 } from "lucide-react";

interface EmotionData {
  stage: string;
  characterEmotion: number;
  readerEmotion: number;
}

interface EmotionChartProps {
  isLoading: boolean;
  emotions: any[] | null;
  emotionData: EmotionData[];
  selectedDocument: string | null;
}

export const EmotionChart = ({ isLoading, emotions, emotionData, selectedDocument }: EmotionChartProps) => {
  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!selectedDocument || !emotions || emotions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {selectedDocument ? "No emotional analysis data available" : "Select a document to view emotional analysis"}
      </div>
    );
  }

  return (
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
        interval={0}
        angle={-45}
        textAnchor="end"
        height={80}
      />
      <YAxis 
        stroke="#6b7280"
        tick={{ fill: '#6b7280' }}
        domain={[0, 10]}
        label={{ value: 'Emotional Intensity', angle: -90, position: 'insideLeft' }}
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
  );
};