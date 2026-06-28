// Content derived from the SPA Design Consultants company profile.
// "We offer the entire compliment of services under one roof" — reducing
// coordination problems, cutting implementation time and ensuring efficient
// budget control. (Scope of Services, SPA-D profile.)

export interface Service {
  slug: string;
  title: string;
  summary: string;
  points: string[];
}

export const services: Service[] = [
  {
    slug: "architecture",
    title: "Architecture & Concept Design",
    summary:
      "From the first sketch to the final elevation, architectural concept, design and master planning for institutional, commercial, industrial and residential projects.",
    points: [
      "Architectural concept & design development",
      "Master planning & site investigation",
      "Town planning",
      "Renovation of existing structures",
      "Exhibition & display design",
    ],
  },
  {
    slug: "structural-engineering",
    title: "Structural Engineering",
    summary:
      "In-house structural design backed by decades of civil and structural expertise, delivering safe, efficient and buildable frames.",
    points: [
      "RCC & steel structure planning",
      "Structural analysis & design",
      "Working drawings & detailing",
      "Earthquake-conscious design",
    ],
  },
  {
    slug: "landscape",
    title: "Landscape & Horticulture",
    summary:
      "Landscape architecture that ties buildings to their surroundings, from arrival courts and water features to planting and horticulture.",
    points: [
      "Landscape master planning",
      "Hardscape & softscape design",
      "Horticulture & planting schemes",
      "Outdoor amenity & courtyard design",
    ],
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    summary:
      "Interior design consultancy and execution, selection of materials, fittings and fixtures for workspaces, retail, hospitality and homes.",
    points: [
      "Space planning & concept interiors",
      "Material, fitting & fixture selection",
      "Turnkey fit-out execution",
      "Furniture & FF&E coordination",
    ],
  },
  {
    slug: "building-services",
    title: "MEP & Building Services",
    summary:
      "Coordinated building services so every system is designed together, electrical, plumbing, HVAC, fire and vertical transport.",
    points: [
      "Electrical design & distribution",
      "Water supply, treatment & sanitation",
      "Air-conditioning & mechanical ventilation",
      "Fire safety, elevators & escalators",
    ],
  },
  {
    slug: "turnkey-execution",
    title: "Turnkey Execution & Project Management",
    summary:
      "Construction management and on-site coordination that takes a project from drawings to completion, on time and on budget.",
    points: [
      "Construction management & site coordination",
      "Coordination of agencies & trades",
      "Budget monitoring & time scheduling",
      "Local-body approvals & completion certification",
    ],
  },
];

// Three-stage delivery process from the SPA-D profile.
export interface ProcessStage {
  stage: string;
  title: string;
  description: string;
}

export const processStages: ProcessStage[] = [
  {
    stage: "Stage I",
    title: "Feasibility & Concept",
    description:
      "Site investigation, master planning, preliminary concept and design, financial analysis and a preliminary project report.",
  },
  {
    stage: "Stage II",
    title: "Design & Documentation",
    description:
      "Architectural and structure planning, all building services, interiors and landscape, plus drawings, specifications, tender documents, cost estimates and the project schedule.",
  },
  {
    stage: "Stage III",
    title: "Construction & Delivery",
    description:
      "Construction management and on-site coordination, administration and budget control, time monitoring, statutory approvals and the certificate of completion.",
  },
];
