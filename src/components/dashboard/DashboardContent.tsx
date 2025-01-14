import { useState, useEffect } from "react";
import { CharactersView } from "@/components/CharactersView";
import { FormattingView } from "@/components/FormattingView";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryView } from "./views/StoryView";
import { StoryLogicView } from "@/components/story-logic/StoryLogicView";
import { useFeatureAccess } from "@/utils/subscriptionUtils";
import { PaywallAlert } from "../PaywallAlert";
import { FeatureKey } from "@/utils/subscriptionUtils";
import { useStory } from "@/contexts/StoryContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type View = "story" | "characters" | "plot" | "ideas" | "docs" | "logic";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<{ name: string; plan: string } | null>(null);
  const { checkFeatureAccess, getRequiredPlan } = useFeatureAccess();
  const { selectedStory } = useStory();
  const [error, setError] = useState<Error | null>(null);
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode | null>(null);

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

  useEffect(() => {
    try {
      let component: React.ReactNode = null;
      
      switch (currentView) {
        case "characters":
          component = <CharactersView />;
          break;
        case "plot":
          if (handleFeatureAccess("Book Creator", "story_docs")) {
            component = <FormattingView />;
          }
          break;
        case "ideas":
          component = <StoryIdeasView />;
          break;
        case "docs":
          if (handleFeatureAccess("Story Documentation", "story_docs")) {
            component = <StoryDocsView />;
          }
          break;
        case "logic":
          if (handleFeatureAccess("Story Logic", "story_logic")) {
            component = <StoryLogicView />;
          }
          break;
        case "story":
          component = <StoryView />;
          break;
        default:
          component = (
            <div className="flex items-center justify-center h-full text-gray-500">
              This feature is coming soon!
            </div>
          );
      }
      
      setCurrentComponent(component);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    }
  }, [currentView, handleFeatureAccess]);

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

  return (
    <>
      {currentComponent}
      
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