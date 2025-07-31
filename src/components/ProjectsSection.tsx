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
  const [key, setKey] = useState(0); // 用于强制重新渲染

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await loadProjects();
        setProjects(projectsData);
        setKey((prev) => prev + 1); // 强制重新渲染以触发parallax动画
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
        <h2 className="section-title project-section-title">
          Featured Projects
        </h2>
        <ProjectsList projects={projects} key={key} />
      </div>
    </section>
  );
};
