import { useState } from "react";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryView } from "./views/StoryView";
import { useFeatureAccess } from "@/utils/subscriptionUtils";
import { PaywallAlert } from "../PaywallAlert";
import { FeatureKey } from "@/utils/subscriptionUtils";
import { useStory } from "@/contexts/StoryContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type View = "story" | "characters" | "plot" | "flow" | "ideas" | "docs";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<{ name: string; plan: string } | null>(null);
  const { checkFeatureAccess, getRequiredPlan } = useFeatureAccess();
  const { selectedStory } = useStory();
  const [error, setError] = useState<Error | null>(null);

  const handleFeatureAccess = (feature: string, requiredFeature: FeatureKey) => {
    if (!checkFeatureAccess(requiredFeature)) {
      setBlockedFeature({
        name: feature,
        plan: getRequiredPlan(requiredFeature) || 'creator'
      });
      setShowPaywallAlert(true);
      return false;
    }
    return true;
  };

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message}
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={() => setError(null)}
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!selectedStory && currentView !== "story") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Story Selected</h2>
          <p className="text-gray-600 mb-4">Please select or create a story to access this feature.</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    try {
      switch (currentView) {
        case "characters":
          return <CharactersView />;
        case "plot":
          return handleFeatureAccess("Plot Development", "backward_planning") ? (
            <PlotDevelopmentView />
          ) : null;
        case "flow":
          return handleFeatureAccess("Story Flow", "backward_planning") ? (
            <StoryFlow />
          ) : null;
        case "ideas":
          return <StoryIdeasView />;
        case "docs":
          return handleFeatureAccess("Story Documentation", "backward_planning") ? (
            <StoryDocsView />
          ) : null;
        case "story":
          return <StoryView />;
        default:
          return (
            <div className="flex items-center justify-center h-full text-gray-500">
              This feature is coming soon!
            </div>
          );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      return null;
    }
  };

  return (
    <>
      {renderView()}
      
      <PaywallAlert
        isOpen={showPaywallAlert}
        onClose={() => {
          setShowPaywallAlert(false);
          setBlockedFeature(null);
        }}
        feature={blockedFeature?.name || ""}
        requiredPlan={blockedFeature?.plan || "creator"}
      />
    </>
  );
};