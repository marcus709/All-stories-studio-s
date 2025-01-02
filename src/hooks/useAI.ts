import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async (prompt: string, type: 'suggestions' | 'traits' | 'goals') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { prompt, type },
      });

      if (error) throw error;

      return data.generatedText;
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    isLoading,
  };
};