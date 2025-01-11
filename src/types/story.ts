export type View = "stories" | "characters" | "plot" | "formatting" | "docs";

export interface DashboardContentProps {
  view: View;
}

export interface DashboardSidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}