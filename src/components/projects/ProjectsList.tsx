"use client";

import React, { useRef } from "react";
import { Parallax } from "react-scroll-parallax";
import { type WebProject } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectsListProps {
  projects: WebProject[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Parallax
      translateX={[30, -190]}
      easing={[0.8, 0.2, 0.2, 1]}
      style={{
        width: "100%",
      }}
    >
      <div
        className="projects-container"
        ref={containerRef}
        style={{
          display: "flex",
          gap: "2rem",
          minWidth: "max-content",
          paddingBottom: "1rem",
        }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Parallax>
  );
};
