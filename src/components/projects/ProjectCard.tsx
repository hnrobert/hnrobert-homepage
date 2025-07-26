"use client";

import React from "react";
import { type WebProject } from "../../data/projects";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectDescription } from "./ProjectDescription";
import { ProjectLanguage } from "./ProjectLanguage";
import { ProjectTopics } from "./ProjectTopics";
import { ProjectStats } from "./ProjectStats";
import { ProjectActions } from "./ProjectActions";

interface ProjectCardProps {
  project: WebProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className={`project-card ${project.loading ? "loading" : ""}`}>
      <ProjectHeader project={project} />
      <ProjectDescription project={project} />
      <ProjectLanguage project={project} />
      <ProjectTopics project={project} />
      <ProjectStats project={project} />
      <ProjectActions project={project} />
    </div>
  );
};
