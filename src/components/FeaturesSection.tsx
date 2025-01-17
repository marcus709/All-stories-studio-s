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
    title: "Story Logic & Historical Analysis",
    description: "Ensure historical accuracy and narrative consistency with our advanced analysis tools. Identify plot holes, timeline inconsistencies, and historical context to create authentic and compelling stories."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden scroll-mt-16">
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200">
            Powerful Features for Every Writer
          </h2>
          <p className="text-lg text-purple-100/80 max-w-3xl mx-auto">
            Enhance your writing journey with our comprehensive suite of tools designed to bring your stories to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
                        hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20
                        hover:-translate-y-1 animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 relative">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 
                                flex items-center justify-center text-purple-200 shadow-sm
                                group-hover:shadow-md transition-shadow duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 
                                rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-purple-100/70 leading-relaxed flex-grow">
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