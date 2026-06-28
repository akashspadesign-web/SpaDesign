export type Discipline = {
  number: string;
  title: string;
  href: string;
  blurb: string;
};

export const disciplines: Discipline[] = [
  {
    number: "01",
    title: "Architecture",
    href: "/expertise/architecture",
    blurb: "Institutional, commercial, residential.",
  },
  {
    number: "02",
    title: "Interiors",
    href: "/expertise/interiors",
    blurb: "Retail, workplace, hospitality — turnkey.",
  },
  {
    number: "03",
    title: "Landscape",
    href: "/expertise/landscape",
    blurb: "Site planning and outdoor environments.",
  },
  {
    number: "04",
    title: "Structural",
    href: "/expertise/structural",
    blurb: "Engineering and analysis. Since 1972.",
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  stage: string;
  description: string;
  items: string[];
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    stage: "Pre-design",
    description: "Site, brief, numbers.",
    items: [
      "Site investigation",
      "Master planning",
      "Concept design",
      "Financial analysis",
      "Project report",
    ],
  },
  {
    number: "02",
    title: "Definition",
    stage: "Design & documentation",
    description: "Architecture, structure and services resolved.",
    items: [
      "Architectural & structural",
      "MEP, HVAC & water",
      "Interiors & materials",
      "Landscaping",
      "BOQ & tenders",
    ],
  },
  {
    number: "03",
    title: "Execution",
    stage: "Construction & delivery",
    description: "From site to completion certificate.",
    items: [
      "Site coordination",
      "Agency & trade coordination",
      "Budget monitoring",
      "Approvals",
      "Completion certificate",
    ],
  },
];

export type ServiceStage = {
  number: string;
  title: string;
  items: string[];
};

export const serviceStages: ServiceStage[] = [
  {
    number: "I",
    title: "Pre-Design",
    items: [
      "Site investigation",
      "Master planning",
      "Preliminary concept & design",
      "Financial analysis",
      "Preliminary project report",
    ],
  },
  {
    number: "II",
    title: "Design & Documentation",
    items: [
      "Architectural planning",
      "Structural planning",
      "Water supply: treatment & distribution",
      "Air conditioning & mechanical ventilation",
      "Hot water generation systems",
      "Kitchen engineering & installation",
      "Elevators & escalators",
      "Material handling systems",
      "Facilities planning / garbage disposal",
      "Interior design, materials, fittings & fixtures",
      "Landscaping & horticulture",
      "Logo preparation",
      "Tender documents, BOQ, cost estimates, time schedules",
    ],
  },
  {
    number: "III",
    title: "Construction & Delivery",
    items: [
      "Construction management & site coordination",
      "Coordination across agencies & trades",
      "Administrative controls",
      "Project accounts & budget monitoring",
      "Time schedule monitoring",
      "Local body inspections & approvals",
      "Certificate of completion",
    ],
  },
];

export const whatWeDo = [
  "Architecture",
  "Interior",
  "Master Planning",
  "Urban Planning",
  "Residential",
  "Office",
  "Hospitality",
  "Industrial",
] as const;

export type Reason = { number: string; title: string; body: string };

export const whyUs: Reason[] = [
  {
    number: "01",
    title: "One studio",
    body: "Architecture, structure, interiors, landscape — under one roof.",
  },
  {
    number: "02",
    title: "Trusted at scale",
    body: "600+ projects, nine typologies, six states.",
  },
  {
    number: "03",
    title: "Multi-disciplinary",
    body: "Architects, engineers, planners, designers. Since 1972.",
  },
  {
    number: "04",
    title: "Build-ready",
    body: "Drawings and BOQs contractors can build from.",
  },
  {
    number: "05",
    title: "Context-led",
    body: "Rooted in site, climate and use.",
  },
  {
    number: "06",
    title: "Accountable",
    body: "Budget, schedule and approvals to completion.",
  },
];
