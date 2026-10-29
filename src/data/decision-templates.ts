export type DecisionTemplateCriterion = {
  name: string;
  weight: number;
};

export type DecisionTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  options: string[];
  criteria: DecisionTemplateCriterion[];
};

export const decisionTemplates: DecisionTemplate[] = [
  {
    id: "career-choice",
    title: "Career Choice",
    description:
      "Compare different career paths based on growth, income, stability, and long-term fit.",
    category: "Career",
    options: [
      "Frontend Developer",
      "UI/UX Designer",
      "Full-Stack Developer",
    ],
    criteria: [
      {
        name: "Salary",
        weight: 0.3,
      },
      {
        name: "Career Growth",
        weight: 0.25,
      },
      {
        name: "Learning",
        weight: 0.2,
      },
      {
        name: "Job Stability",
        weight: 0.15,
      },
      {
        name: "Work-Life Balance",
        weight: 0.1,
      },
    ],
  },

  {
    id: "job-offer",
    title: "Job Offer",
    description:
      "Evaluate multiple job offers beyond salary and find the opportunity with the strongest overall value.",
    category: "Career",
    options: ["Offer A", "Offer B", "Offer C"],
    criteria: [
      {
        name: "Salary",
        weight: 0.3,
      },
      {
        name: "Benefits",
        weight: 0.15,
      },
      {
        name: "Career Growth",
        weight: 0.2,
      },
      {
        name: "Location",
        weight: 0.15,
      },
      {
        name: "Flexibility",
        weight: 0.2,
      },
    ],
  },

  {
    id: "university-selection",
    title: "University Selection",
    description:
      "Compare universities using the factors that matter most for your education and future career.",
    category: "Education",
    options: ["University A", "University B", "University C"],
    criteria: [
      {
        name: "Tuition",
        weight: 0.2,
      },
      {
        name: "Education Quality",
        weight: 0.25,
      },
      {
        name: "Career Opportunities",
        weight: 0.25,
      },
      {
        name: "Location",
        weight: 0.1,
      },
      {
        name: "Reputation",
        weight: 0.2,
      },
    ],
  },

  {
    id: "relocation",
    title: "Relocation",
    description:
      "Compare cities or countries before making a major relocation decision.",
    category: "Lifestyle",
    options: ["City A", "City B", "City C"],
    criteria: [
      {
        name: "Cost of Living",
        weight: 0.25,
      },
      {
        name: "Career Opportunities",
        weight: 0.25,
      },
      {
        name: "Safety",
        weight: 0.2,
      },
      {
        name: "Quality of Life",
        weight: 0.2,
      },
      {
        name: "Community",
        weight: 0.1,
      },
    ],
  },

  {
    id: "major-purchase",
    title: "Major Purchase",
    description:
      "Compare expensive purchases using price, quality, durability, and overall value.",
    category: "Shopping",
    options: ["Product A", "Product B", "Product C"],
    criteria: [
      {
        name: "Price",
        weight: 0.25,
      },
      {
        name: "Quality",
        weight: 0.25,
      },
      {
        name: "Features",
        weight: 0.15,
      },
      {
        name: "Durability",
        weight: 0.2,
      },
      {
        name: "Value",
        weight: 0.15,
      },
    ],
  },
];