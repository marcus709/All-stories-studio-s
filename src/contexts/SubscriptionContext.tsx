import { createContext, useContext, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

type SubscriptionPlan = 'free' | 'creator' | 'professional';

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isLoading: boolean;
  checkFeatureAccess: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  plan: 'free',
  isLoading: true,
  checkFeatureAccess: () => false,
});

export const useSubscription = () => useContext(SubscriptionContext);

const featureMatrix = {
  free: {
    max_stories: 1,
    max_characters: 5,
    ai_prompts: 2,
    community_access: false,
    custom_ai: 0,
    backward_planning: false,
  },
  creator: {
    max_stories: 10,
    max_characters: 25,
    ai_prompts: Infinity,
    community_access: true,
    custom_ai: 1,
    backward_planning: true,
  },
  professional: {
    max_stories: Infinity,
    max_characters: Infinity,
    ai_prompts: Infinity,
    community_access: true,
    custom_ai: 5,
    backward_planning: true,
  }
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      if (!session) {
        setPlan('free');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        if (error) throw error;
        setPlan(data.plan);
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Failed to check subscription status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [session, supabase, toast]);

  const checkFeatureAccess = (feature: keyof typeof featureMatrix.free): boolean => {
    return !!featureMatrix[plan][feature];
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isLoading, checkFeatureAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
};