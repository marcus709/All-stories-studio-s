import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X } from "lucide-react";
import { Card } from "./ui/card";

interface Story {
  title: string;
  description: string;
  lastEdited: string;
}

const stories: Story[] = [
  {
    title: "fsfsf",
    description: "sfsf",
    lastEdited: "4d ago"
  },
  {
    title: "test nr 2",
    description: "qeqe",
    lastEdited: "4d ago"
  },
  {
    title: "test historie",
    description: "wdawdaw",
    lastEdited: "4d ago"
  }
];

export function StoriesDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showNewStory, setShowNewStory] = React.useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">Your Stories</DialogTitle>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <Button
            onClick={() => {
              setIsOpen(false);
              setShowNewStory(true);
            }}
            variant="outline"
            className="w-full border-dashed border-2 py-8 mb-6 hover:border-purple-500 hover:text-purple-500 group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:text-purple-500" />
            Create New Story
          </Button>

          <div className="grid grid-cols-3 gap-4">
            {stories.map((story) => (
              <Card key={story.title} className="bg-purple-50 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                <div className="w-12 h-12 mb-4 text-purple-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">{story.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{story.description}</p>
                <div className="text-xs text-gray-500">
                  Last edited {story.lastEdited}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewStory} onOpenChange={setShowNewStory}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold">Create New Story</DialogTitle>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setShowNewStory(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          {/* Add your new story form content here */}
        </DialogContent>
      </Dialog>

      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span className="font-medium">View All Stories</span>
      </button>
    </>
  );
}