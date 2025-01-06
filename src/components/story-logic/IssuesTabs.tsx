import { issueTypeInfo } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssuesList } from "./IssuesList";
import { StoryIssue } from "@/types/story";

interface IssuesTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  storyIssues: StoryIssue[];
  isLoading: boolean;
}

export const IssuesTabs = ({ activeTab, setActiveTab, storyIssues, isLoading }: IssuesTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
      <TabsList className="grid grid-cols-4 mb-6">
        {Object.entries(issueTypeInfo).map(([type, info]) => (
          <TabsTrigger key={type} value={type} className="flex items-center gap-2">
            <info.icon className={`h-4 w-4 ${info.color}`} />
            {info.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.keys(issueTypeInfo).map((type) => (
        <TabsContent key={type} value={type}>
          <IssuesList
            issues={storyIssues}
            issueType={type}
            isLoading={isLoading}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};