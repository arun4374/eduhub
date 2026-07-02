export interface DepartmentConfig {
  slug: string
  shortName: "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL"
  fullName: string
  bannerImage: string
  description: string
  iconName: "Laptop" | "Cpu" | "Zap" | "Settings" | "Building"
}

export const DEPARTMENTS: DepartmentConfig[] = [
  {
    slug: "cse",
    shortName: "CSE",
    fullName: "Computer Science and Engineering",
    bannerImage: "https://picsum.photos/seed/cse/1200/400",
    description: "Access curated lecture notes, syllabus checklists, and standard question papers for Computer Science and Engineering (CSE), Regulation 2021.",
    iconName: "Laptop",
  },
  {
    slug: "ece",
    shortName: "ECE",
    fullName: "Electronics and Communication Engineering",
    bannerImage: "https://picsum.photos/seed/ece/1200/400",
    description: "Browse academic assets, reference books, and previous year assessments for Electronics and Communication Engineering (ECE).",
    iconName: "Cpu",
  },
  {
    slug: "eee",
    shortName: "EEE",
    fullName: "Electrical and Electronics Engineering",
    bannerImage: "https://picsum.photos/seed/eee/1200/400",
    description: "Find Power Systems, Control Engineering, and AC/DC Electrical Machines resources formatted for Electrical and Electronics Engineering (EEE).",
    iconName: "Zap",
  },
  {
    slug: "mech",
    shortName: "MECH",
    fullName: "Mechanical Engineering",
    bannerImage: "https://picsum.photos/seed/mech/1200/400",
    description: "Get thermodynamic tables, CAD design briefs, and Kinematics of Machinery calculations tailored for Mechanical Engineering (MECH).",
    iconName: "Settings",
  },
  {
    slug: "civil",
    shortName: "CIVIL",
    fullName: "Civil Engineering",
    bannerImage: "https://picsum.photos/seed/civil/1200/400",
    description: "Obtain Fluid Mechanics guides, Mechanics of Solids equations, and Levelling/Surveying field worksheets for Civil Engineering (CIVIL).",
    iconName: "Building",
  }
];
