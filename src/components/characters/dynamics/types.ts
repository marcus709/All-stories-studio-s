export type TensionPointType = 'rising' | 'falling' | 'climax' | 'resolution';

export interface TensionPoint {
  id: string;
  story_id: string;
  position: number;
  tension_level: number;
  description: string | null;
  type: TensionPointType;
}