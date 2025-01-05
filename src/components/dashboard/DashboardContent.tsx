import { useState } from "react";
import { CharactersView } from "@/components/CharactersView";
import { PlotDevelopmentView } from "@/components/PlotDevelopmentView";
import { StoryFlow } from "@/components/story-flow/StoryFlow";
import { StoryIdeasView } from "@/components/StoryIdeasView";
import { StoryDocsView } from "@/components/docs/StoryDocsView";
import { StoryView } from "./views/StoryView";
import { useFeatureAccess } from "@/utils/subscriptionUtils";
import { PaywallAlert } from "../PaywallAlert";

type View = "story" | "characters" | "plot" | "flow" | "ideas" | "docs";

interface DashboardContentProps {
  currentView: View;
}

export const DashboardContent = ({ currentView }: DashboardContentProps) => {
  const [showPaywallAlert, setShowPaywallAlert] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<{ name: string; plan: string } | null>(null);
  const { checkFeatureAccess, getRequiredPlan } = useFeatureAccess();

  const handleFeatureAccess = (feature: string, requiredFeature: keyof typeof featureMatrix.free) => {
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

  const renderView = () => {
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