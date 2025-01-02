export interface PlotStructure {
  id: string;
  name: string;
  stages: string[];
}

export interface PlotEventType {
  id: string;
  story_id: string;
  stage: string;
  title: string;
  description: string | null;
  order_index: number;
}