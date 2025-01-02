import { useState } from "react";
import { Search, Plus, Tag, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CreateStoryIdeaDialog } from "./CreateStoryIdeaDialog";

export const StoryIdeasView = () => {
  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Story Ideas</h1>
          <p className="text-gray-500">Capture and organize your creative ideas</p>
        </div>
        <CreateStoryIdeaDialog />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search ideas..."
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <div className="text-purple-500">
                {/* Placeholder icon or initial */}
                ?
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">wqeqw</h3>
              <p className="text-gray-600 text-sm mb-2">ewqeqwe</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>qweqwe</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Created 4d ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};