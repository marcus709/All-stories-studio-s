import { Brain, Users, MessageSquare, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FeaturesSection = () => {
  return (
    <div className="w-full py-20 lg:py-40 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Features</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                Powerful Features for Every Writer
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-gray-600 text-left">
                Enhance your writing journey with our comprehensive suite of tools designed to bring your stories to life.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <Brain className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight text-gray-800">Vibrant Writing Community</h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Join a thriving community of writers, share experiences, and get inspired. Collaborate, receive feedback, and grow together.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <Users className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight text-gray-800">Dynamic Character Development</h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Create deep, memorable characters that seamlessly integrate with our AI writing assistant.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md aspect-square p-6 flex justify-between flex-col">
              <MessageSquare className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight text-gray-800">Plot Development Tools</h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Craft engaging storylines with our intuitive plot development tools. Structure your narrative and track story arcs effortlessly.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-md h-full lg:col-span-2 p-6 aspect-square lg:aspect-auto flex justify-between flex-col">
              <Target className="w-8 h-8 stroke-1" />
              <div className="flex flex-col">
                <h3 className="text-xl tracking-tight text-gray-800">Story Logic & Historical Analysis</h3>
                <p className="text-gray-600 max-w-xs text-base">
                  Ensure historical accuracy and narrative consistency with our advanced analysis tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}