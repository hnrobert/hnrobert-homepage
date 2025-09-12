"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectLanguageProps {
  project: WebProject;
}

export const ProjectLanguage: React.FC<ProjectLanguageProps> = ({
  project,
}) => {
  if (project.loading) {
    return (
      <div className="project-languages">
        <span className="languages-label">Language:</span>
        <div className="skeleton skeleton-language-tag"></div>
      </div>
    );
  }

  if (!project.language || project.language === "Unknown") {
    return null;
  }

  return (
    <div className="project-languages">
      <span className="languages-label">Language:</span>
      <span className="language-tag">{project.language}</span>
    </div>
  );
};
