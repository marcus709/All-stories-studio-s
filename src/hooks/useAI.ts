import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async (
    prompt: string, 
    type: 'suggestions' | 'traits' | 'goals',
    context?: {
      storyDescription?: string;
      characters?: string;
      traits?: string;
      aiConfig?: {
        model_type: 'gpt-4o' | 'gpt-4o-mini';
        system_prompt?: string;
        temperature: number;
        max_tokens: number;
      };
    }
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-content', {
        body: { 
          prompt, 
          type, 
          context,
          aiConfig: context?.aiConfig
        },
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