import { BookOpen, Star, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { LampContainer } from "./ui/lamp";

const stories = [
  {
    title: "The Lost Library",
    description: "In a world where books have become rare artifacts, one librarian's quest to preserve knowledge takes an unexpected turn...",
    author: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
    rating: 4.9,
    category: "Mystery",
    isShared: false
  },
  {
    title: "Echoes of Tomorrow",
    description: "A young scientist discovers a way to hear fragments of future conversations, but each revelation comes with an unforeseen cost...",
    author: "Marcus Rivera",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80",
    rating: 4.7,
    category: "Science Fiction",
    isShared: true
  }
];

export const StoriesSection = () => {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 font-mono text-white">
            Featured Stories
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Discover incredible stories crafted by our community of writers using AI-powered tools.
          </p>
        </div>
        
        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <Card 
                key={index}
                className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-zinc-900/50 backdrop-blur-sm ${
                  story.isShared ? 'border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {story.isShared && (
                      <Badge className="bg-purple-500 text-white hover:bg-purple-600">
                        <Users className="h-3 w-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                    <Badge 
                      className="bg-zinc-800/60 text-purple-200 hover:bg-zinc-700/80 backdrop-blur-sm"
                    >
                      {story.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">By {story.author}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-300">{story.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-purple-400 transition-colors text-white">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-2 font-light">
                    {story.description}
                  </p>
                  
                  <div className="flex items-center text-purple-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="w-full h-[600px] bg-black">
            <LampContainer className="w-full h-full">
              <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
              >
                Cast Light on <br /> Your Stories
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="text-gray-400 mt-4 text-center text-lg"
              >
                A platform where your creativity shines bright
              </motion.p>
            </LampContainer>
          </div>
        </div>
      </div>
    </section>
  );
}