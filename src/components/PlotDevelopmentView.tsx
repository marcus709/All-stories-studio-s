import { Card } from "@/components/ui/card";

export const PlotDevelopmentView = () => {
  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Plot Development</h2>
          <p className="text-muted-foreground">
            Plot development features will be implemented here.
          </p>
        </Card>
      </div>
    </div>
  );
};