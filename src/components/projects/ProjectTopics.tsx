"use client";

import React from "react";
import { type WebProject } from "../../data/projects";

interface ProjectTopicsProps {
  project: WebProject;
}

export const ProjectTopics: React.FC<ProjectTopicsProps> = ({ project }) => {
  if (project.loading) {
    return (
      <div className="project-tech">
        <div className="skeleton skeleton-tech-tag"></div>
        <div className="skeleton skeleton-tech-tag"></div>
        <div className="skeleton skeleton-tech-tag"></div>
      </div>
    );
  }

  if (!project.topics || project.topics.length === 0) {
    return null;
  }

  return (
    <div className="project-tech">
      {project.topics.slice(0, 4).map((topic: string, index: number) => (
        <span key={index} className="project-tech-tag">
          {topic}
        </span>
      ))}
      {project.topics.length > 4 && (
        <span className="tech-more">+{project.topics.length - 4} more</span>
      )}
    </div>
  );
};
