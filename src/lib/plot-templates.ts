import { PlotTemplate } from "@/types/plot";

export const plotTemplates: PlotTemplate[] = [
  {
    id: "three-act",
    name: "Three Act Structure",
    genre: "Universal",
    stages: ["Setup", "Confrontation", "Resolution"],
    plotPoints: [
      "Introduce protagonist and their normal world",
      "Inciting incident",
      "First plot point",
      "Rising action and complications",
      "Midpoint",
      "More complications",
      "All is lost moment",
      "Climactic sequence",
      "Resolution"
    ]
  },
  {
    id: "hero-journey",
    name: "Hero's Journey",
    genre: "Adventure",
    stages: ["Departure", "Initiation", "Return"],
    plotPoints: [
      "Ordinary World",
      "Call to Adventure",
      "Refusal of the Call",
      "Meeting the Mentor",
      "Crossing the Threshold",
      "Tests, Allies, and Enemies",
      "Approach to the Inmost Cave",
      "Ordeal",
      "Reward",
      "The Road Back",
      "Resurrection",
      "Return with the Elixir"
    ]
  }
];