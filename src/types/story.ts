export interface Document {
  id: string;
  title: string;
  content: string;
  story_id: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  time_period?: string;
  time_period_details?: {
    year: string;
    season: string;
    time_of_day: string;
    weather: string;
    environment: string;
  };
}
