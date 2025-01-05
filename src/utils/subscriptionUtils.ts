import { useSubscription } from "@/contexts/SubscriptionContext";

export const featureMatrix = {
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
} as const;

export type FeatureKey = keyof typeof featureMatrix.free;

export const useFeatureAccess = () => {
  const { plan, checkFeatureAccess } = useSubscription();
  
  const getRequiredPlan = (feature: FeatureKey, requiredValue?: number): 'creator' | 'professional' | null => {
    if (featureMatrix.creator[feature] === Infinity || 
        (typeof featureMatrix.creator[feature] === 'number' && 
         featureMatrix.creator[feature] >= (requiredValue || 0))) {
      return 'creator';
    }
    if (featureMatrix.professional[feature] === Infinity || 
        (typeof featureMatrix.professional[feature] === 'number' && 
         featureMatrix.professional[feature] >= (requiredValue || 0))) {
      return 'professional';
    }
    return null;
  };

  return {
    plan,
    checkFeatureAccess,
    getRequiredPlan,
    currentLimits: featureMatrix[plan]
  };
};