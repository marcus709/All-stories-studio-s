import React from "react";
import { Card } from "../ui/card";

interface StoryCardProps {
  story: {
    id: string;
    title: string;
    description: string | null;
    updated_at: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function StoryCard({ story, isSelected, onClick }: StoryCardProps) {
  return (
    <Card 
      className={`bg-purple-50 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors ${
        isSelected ? "ring-2 ring-purple-500" : ""
      }`}
      onClick={onClick}
    >
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
        Last edited {new Date(story.updated_at).toLocaleDateString()}
      </div>
    </Card>
  );
}