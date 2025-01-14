import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Plus, Template, BookOpen } from "lucide-react";

const initialPlotData = [
  {
    title: "Act 1",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Setup and Introduction
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Introduce main characters
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Establish the setting
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Present the initial conflict
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Act 2",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Rising Action and Complications
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Develop subplots
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Increase tension
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Character development
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Act 3",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Resolution and Conclusion
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Climactic scene
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Resolve conflicts
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
            ✅ Character arcs completion
          </div>
        </div>
      </div>
    ),
  },
];

export const PlotDevelopmentView = () => {
  const [plotData, setPlotData] = useState(initialPlotData);

  const addNewAct = () => {
    const newActNumber = plotData.length + 1;
    setPlotData([
      ...plotData,
      {
        title: `Act ${newActNumber}`,
        content: (
          <div>
            <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
              New Act Development
            </p>
            <div className="mb-8">
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Define key events
              </div>
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Advance the plot
              </div>
              <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                ✅ Further character growth
              </div>
            </div>
          </div>
        ),
      },
    ]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Plot Development Timeline</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your story's progression through the three-act structure
          </p>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Acts</h3>
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{plotData.length}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total story acts</p>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <Button 
              onClick={addNewAct}
              className="w-full h-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add New Act
            </Button>
          </Card>

          <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <Button 
              variant="outline"
              className="w-full h-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Template className="h-5 w-5" />
              Use Template
            </Button>
          </Card>
        </div>

        <div className="w-full">
          <Timeline data={plotData} />
        </div>
      </div>
    </div>
  );
};