"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectHeaderProps {
  project: WebProject;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const formatStars = (stars: number): string => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  const getRepoNameFromUrl = (url: string): string => {
    try {
      const match = url.match(/github\.com\/[^\/]+\/([^\/]+)/);
      return match ? match[1].replace(/-/g, " ") : "Repository";
    } catch {
      return "Repository";
    }
  };
  return (
    <div className="project-header">
      <h3 className="project-title">
        {project.loading
          ? getRepoNameFromUrl(project.repository)
          : project.title}
      </h3>
      <div className="project-status">
        {project.loading ? (
          <div className="skeleton skeleton-badge"></div>
        ) : (
          <>
            <span className={`status-badge status-${project.status}`}>
              {project.status}
            </span>
            {project.stars > 0 && (
              <span className="stars-badge">
                ⭐ {formatStars(project.stars)}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
