import { AlertTriangle, Clock, Users } from "lucide-react";

export const issueTypeInfo = {
  plot_hole: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    label: "Plot Holes",
  },
  timeline_inconsistency: {
    icon: Clock,
    color: "text-blue-500",
    label: "Timeline Issues",
  },
  pov_confusion: {
    icon: Users,
    color: "text-purple-500",
    label: "POV Confusion",
  },
  character_inconsistency: {
    icon: AlertTriangle,
    color: "text-red-500",
    label: "Character Inconsistencies",
  },
} as const;