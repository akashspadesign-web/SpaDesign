export type TeamMember = {
  name: string;
  /** "(Director)" etc. — appended after the name when set. */
  suffix?: string;
  qualification: string;
  experience: string;
};

export const team: TeamMember[] = [
  {
    name: "Late Satyedeo Prasad Agrawal",
    suffix: "(Founder)",
    qualification:
      "Bsc. Engg. (Civil), PG Dip. (Structure), LLB, MCA, FIV, FIA, AIIA",
    experience: "52 years",
  },
  {
    name: "Ar. Prabhat Agrawal",
    suffix: "(Director)",
    qualification: "B. Arch, Member of Council of Architecture",
    experience: "28 years",
  },
  {
    name: "Dr. Amit Kumar Agarwal",
    qualification:
      "B.E. (Civil Engg.), M.E. (Structural Engg.), PhD (Civil Engg., Structural specialization)",
    experience: "25 years",
  },
  {
    name: "Ar. Shweta Agrawal",
    qualification: "B. Arch, PG Dip. (Landscape Architecture), MCA",
    experience: "22 years",
  },
  {
    name: "Ar. Umang Jain",
    qualification: "B. Arch",
    experience: "5 years",
  },
  {
    name: "Ar. Mili Arora",
    qualification: "B. Arch, M.Arch",
    experience: "3 years",
  },
  {
    name: "Priti Agrawal",
    suffix: "(Director)",
    qualification: "Interior Design",
    experience: "17 years",
  },
  {
    name: "Ritu Agarwal",
    qualification: "B.Arch, M.Arch",
    experience: "17 years",
  },
  {
    name: "Amarnath Sharma",
    qualification: "Construction Manager",
    experience: "35 years",
  },
  {
    name: "Er. Mukesh Kumar Pankaj",
    qualification: "B.E. (Civil Engg.)",
    experience: "19 years",
  },
  {
    name: "Sachhitanand",
    qualification: "Diploma in Civil Engg.",
    experience: "14 years",
  },
  {
    name: "Avinash Gupta",
    qualification: "B.Com",
    experience: "6 years",
  },
  {
    name: "Prashant Gupta",
    qualification: "B.Com",
    experience: "2 years",
  },
];
