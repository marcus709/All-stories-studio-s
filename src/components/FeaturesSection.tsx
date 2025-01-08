import { Brain, Users, MessageSquare, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Character-Aware AI Enhancement",
    description: "Our AI understands and adapts to your characters, using their traits, motivations, and relationships to provide contextually relevant writing suggestions and improvements."
  },
  {
    icon: Users,
    title: "Dynamic Character Development",
    description: "Create deep, memorable characters that seamlessly integrate with our AI writing assistant, ensuring consistent character voices and behaviors throughout your story."
  },
  {
    icon: MessageSquare,
    title: "Vibrant Writing Community",
    description: "Connect with fellow writers, share characters and stories, and get inspired by our thriving community. Your shared creations help enrich everyone's writing experience."
  },
  {
    icon: Target,
    title: "Contextual Story Planning",
    description: "Start with your desired ending and let our AI help craft the perfect path there, while staying true to your established characters and world."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden scroll-mt-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400/60 to-pink-400/60">
            Powerful Features for Every Writer
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your writing journey with our comprehensive suite of tools designed to bring your stories to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-gray-100 
                        hover:border-purple-100 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/20
                        hover:-translate-y-1 animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-400/40 to-pink-400/40 
                                flex items-center justify-center text-purple-600 shadow-sm
                                group-hover:shadow-md transition-shadow duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-100/20 to-pink-100/20 
                                rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.02),transparent_70%)]" />
    </section>
  );
};