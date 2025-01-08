import { BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const stories = [
  {
    title: "The Lost Library",
    description: "In a world where books have become rare artifacts, one librarian's quest to preserve knowledge takes an unexpected turn...",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
    rating: 4.9,
    category: "Mystery"
  },
  {
    title: "Beyond the Stars",
    description: "A deep space exploration mission discovers more than just new planets - they find the very essence of humanity...",
    author: "Marcus Wright",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80",
    rating: 4.8,
    category: "Sci-Fi"
  }
];

export const StoriesSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Featured Stories
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover incredible stories crafted by our community of writers using AI-powered tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {stories.map((story, index) => (
            <Card 
              key={story.title}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <Badge 
                  className="absolute top-4 right-4 z-20 bg-white/90 text-purple-600 hover:bg-white"
                >
                  {story.category}
                </Badge>
              </div>
              
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-sm text-gray-500">By {story.author}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">{story.rating}</span>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 group-hover:text-purple-600 transition-colors">
                  {story.title}
                </h3>
                
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
                  {story.description}
                </p>
                
                <div className="flex items-center text-purple-600">
                  <BookOpen className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};