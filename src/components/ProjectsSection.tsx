"use client";

import React, { useState, useEffect } from "react";
import {
  loadProjects,
  getPlaceholderProjects,
  type WebProject,
} from "../data/projects";
import { ProjectsList } from "./projects";

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>(() =>
    getPlaceholderProjects()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await loadProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error("Failed to load projects:", err);
        // Keep placeholder data if loading fails
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      className="section"
      id="featured-projects"
      style={{
        position: "relative",
      }}
    >
      <div className="glass-card">
        <h2 className="section-title">Featured Projects</h2>
        <ProjectsList projects={projects} />
      </div>
    </section>
  );
};
