"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectActionsProps {
  project: WebProject;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({ project }) => {
  return (
    <div className="project-actions">
      <a
        href={project.repository}
        target="_blank"
        rel="noopener noreferrer"
        className="project-link"
      >
        View on GitHub →
      </a>
    </div>
  );
};
