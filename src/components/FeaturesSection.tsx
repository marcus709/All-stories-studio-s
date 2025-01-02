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
    <section id="features" className="py-20 px-4 bg-white scroll-mt-16">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Powerful Features for Every Writer
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};