export interface Project {
  title: string;
  description: string;
  tech: string[];
}

export const projectsData: Project[] = [
  {
    title: "Project Alpha",
    description: "A revolutionary app built with React and TypeScript",
    tech: ["React", "TypeScript", "Node.js"],
  },
  {
    title: "Unity Game Engine",
    description: "3D game development with advanced physics",
    tech: ["Unity", "C#", "3D Graphics"],
  },
  {
    title: "VSCode Extension",
    description: "Productivity extension for developers",
    tech: ["TypeScript", "VSCode API"],
  },
];
