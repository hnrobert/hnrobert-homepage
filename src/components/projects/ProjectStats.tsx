"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectStatsProps {
  project: WebProject;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  if (project.loading) {
    return (
      <div className="project-stats">
        <div className="skeleton skeleton-stat"></div>
        <div className="skeleton skeleton-stat"></div>
      </div>
    );
  }

  return (
    <div className="project-stats">
      {project.forks > 0 && (
        <span className="stat-item">🍴 {project.forks} forks</span>
      )}
      <span className="stat-item">
        📅 Updated {new Date(project.lastUpdated).toLocaleDateString()}
      </span>
    </div>
  );
};
