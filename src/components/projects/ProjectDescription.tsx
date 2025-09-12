"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectDescriptionProps {
  project: WebProject;
}

export const ProjectDescription: React.FC<ProjectDescriptionProps> = ({
  project,
}) => {
  if (project.loading) {
    return (
      <div className="project-description">
        <div className="skeleton skeleton-description"></div>
      </div>
    );
  }

  return (
    <>
      <p className="project-description">{project.description}</p>
      {/* Error Display */}
      {project.error && (
        <div className="project-error">
          <span className="error-label">⚠️ Error:</span>
          <span className="error-text">{project.error}</span>
        </div>
      )}
    </>
  );
};
