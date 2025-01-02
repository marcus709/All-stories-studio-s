import { BookOpen } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const stories = [
  {
    title: "The Lost Library",
    description: "In a world where books have become rare artifacts, one librarian's quest to preserve knowledge takes an unexpected turn...",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80"
  },
  {
    title: "Beyond the Stars",
    description: "A deep space exploration mission discovers more than just new planets - they find the very essence of humanity...",
    author: "Marcus Wright",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80"
  }
];

export const StoriesSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Stories That Inspire
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <Card key={story.title} className="overflow-hidden">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-3">{story.title}</h3>
                <p className="text-gray-600 mb-4">{story.description}</p>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-500">By {story.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
