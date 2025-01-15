import { useState, useEffect } from "react";
import { CharactersView } from "@/components/CharactersView";
import { FormattingView } from "@/components/FormattingView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
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

type View = "story" | "characters" | "plot" | "dream" | "ideas" | "docs" | "logic";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<{ name: string; plan: string } | null>(null);
  const { checkFeatureAccess, getRequiredPlan } = useFeatureAccess();
  const { selectedStory, setSelectedStory } = useStory();
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

  // Reset error state when view changes
  useEffect(() => {
    setError(null);
  }, [currentView]);

  // Reset error state when story changes
  useEffect(() => {
    setError(null);
  }, [selectedStory]);

  useEffect(() => {
    try {
      let component: React.ReactNode = null;
      
      // Only attempt to render components that require a story if one is selected
      // or if we're on the story view which handles the no-story case internally
      if (selectedStory || currentView === "story") {
        switch (currentView) {
          case "characters":
            component = <CharactersView />;
            break;
          case "plot":
            if (handleFeatureAccess("Book Creator", "story_docs")) {
              component = <FormattingView />;
            }
            break;
          case "dream":
            if (handleFeatureAccess("Plot Development", "story_docs")) {
              component = <PlotDevelopmentView />;
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
      } else {
        // Show a friendly message when no story is selected
        component = (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <AlertCircle className="w-12 h-12 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">No Story Selected</h2>
            <p className="text-gray-600 max-w-md text-center">
              Please select or create a story to access this feature.
            </p>
          </div>
        );
      }
      
      setCurrentComponent(component);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
    }
  }, [currentView, selectedStory, handleFeatureAccess]);

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