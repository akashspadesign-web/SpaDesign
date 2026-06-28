export const site = {
  name: "SPA Design Consultants",
  legalName: "SPA Design Consultants Pvt. Ltd.",
  tagline: "Renovate Your Imaginations",
  disciplines: "Architects · Engineers · Landscape & Interior Designers",
  foundedYear: 1972,
  incorporatedDate: "18 November 2005",
  website: "spadesign.in",
  url: "https://spadesign.in",
  description:
    "Noida-based architecture, engineering, landscape and interior design firm. 600+ projects delivered across India since 1972.",
} as const;

export const offices = {
  head: {
    label: "Head Office",
    line1: "E-33, Sector 3",
    city: "Noida (U.P.) 201301",
    country: "India",
  },
  branch: {
    label: "Branch Office",
    line1: "Pushpanjali, Dak Bunglow Road",
    city: "Daltonganj, Palamau, Jharkhand",
    country: "India",
  },
} as const;

export const contact = {
  phones: ["9811402204", "8178607752", "9811032204"],
  emails: ["spa_design51@yahoo.com", "spadesign@rediffmail.com"],
} as const;

export const stats = [
  { value: 600, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Years Since 1972" },
  { value: 13, suffix: "", label: "Multi-disciplinary Experts" },
  { value: 9, suffix: "", label: "Project Categories" },
] as const;

type NavLink = {
  label: string;
  href: string;
  children?: ReadonlyArray<{ label: string; href: string }>;
};

export const navLinks: readonly NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const socials = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
] as const;
