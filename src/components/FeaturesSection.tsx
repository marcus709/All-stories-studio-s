import { Brain, Users, MessageSquare, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Character-Aware AI",
    description: "Our AI understands and adapts to your characters, providing contextually relevant writing suggestions that maintain consistency."
  },
  {
    icon: Users,
    title: "Dynamic Development",
    description: "Create deep, memorable characters that evolve naturally through your story with our advanced character development system."
  },
  {
    icon: MessageSquare,
    title: "Writing Community",
    description: "Join a thriving community of writers. Share your work, get feedback, and find inspiration from fellow storytellers."
  },
  {
    icon: Target,
    title: "Story Analysis",
    description: "Ensure historical accuracy and narrative consistency with our advanced analysis tools and real-time feedback."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-4 relative overflow-hidden bg-white">
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Craft Your Story
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional tools designed to bring your stories to life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-black 
                                flex items-center justify-center text-white
                                group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};