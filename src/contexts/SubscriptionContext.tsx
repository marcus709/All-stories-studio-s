import { createContext, useContext, useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { featureMatrix } from "@/utils/subscriptionUtils";

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