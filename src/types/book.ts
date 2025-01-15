export interface Template {
  id: string;
  name: string;
  genre: string;
  colors: string[];
  aiConfig?: {
    tone?: 'formal' | 'casual' | 'professional' | 'creative';
    style?: 'descriptive' | 'concise' | 'technical' | 'narrative';
    focusAreas?: ('character' | 'plot' | 'setting' | 'theme')[];
    customInstructions?: string;
  };
}
