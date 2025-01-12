import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface InsightsSidebarProps {
  document: {
    id: string;
    title: string;
    content: string;
  };
}

export const InsightsSidebar = ({ document }: InsightsSidebarProps) => {
  return (
    <Sidebar className="w-80 border-r">
      <SidebarHeader className="border-b p-4">
        <h2 className="text-lg font-semibold">Document Insights</h2>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Word Count</h3>
              <p className="text-sm text-muted-foreground">
                {document.content.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Character Count</h3>
              <p className="text-sm text-muted-foreground">
                {document.content.length} characters
              </p>
            </div>
            {/* More insights can be added here */}
          </div>
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
};