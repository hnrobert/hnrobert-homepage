"use client";

import React, { useState, useEffect } from "react";
import { ProjectsList } from "./projects";

// 简化的项目接口
export interface WebProject {
  id: string;
  title: string;
  description: string;
  repository: string;
  language: string;
  languages: string[];
  topics: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  status: 'active' | 'archived' | 'experimental';
  loading?: boolean;
  error?: string;
}

// 获取占位符项目
function getPlaceholderProjects(): WebProject[] {
  const projectUrls = require('../configs/config.json').featuredProjects as string[];
  return projectUrls.map((url) => {
    const parsed = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    return {
      id: parsed ? `${parsed[1]}/${parsed[2]}` : url,
      title: parsed ? parsed[2].replace(/-/g, ' ') : 'Loading...',
      description: 'Loading project information...',
      repository: url,
      language: 'Loading...',
      languages: [],
      topics: [],
      stars: 0,
      forks: 0,
      lastUpdated: new Date().toISOString(),
      status: 'active',
      loading: true,
    };
  });
}

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>(() =>
    getPlaceholderProjects()
  );
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectUrls = require('../configs/config.json').featuredProjects as string[];

        // 异步并发处理所有项目
        const fetchPromises = projectUrls.map(async (url, index) => {
          try {
            const parsed = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!parsed) return null;

            const response = await fetch(`/api/github/repos/${parsed[1]}/${parsed[2]}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const repoData = await response.json();

            const projectInfo: WebProject = {
              id: `${parsed[1]}/${parsed[2]}`,
              title: repoData.name.replace(/-/g, ' '),
              description: repoData.description || 'No description available',
              repository: url,
              language: repoData.language || 'Unknown',
              languages: repoData.languages?.slice(0, 8).map((l: any) => l.name) || [],
              topics: repoData.topics || [],
              stars: repoData.stargazers_count || 0,
              forks: repoData.forks_count || 0,
              lastUpdated: repoData.updated_at,
              status: repoData.archived ? 'archived' : 'active',
            };

            // 先到先处理：立即更新这个项目
            setProjects(prev => {
              const newProjects = [...prev];
              newProjects[index] = projectInfo;
              return newProjects;
            });

            return projectInfo;
          } catch (err) {
            console.error(`Failed to load project ${index}:`, err);

            // 错误处理：更新为错误状态
            setProjects(prev => {
              const newProjects = [...prev];
              newProjects[index] = {
                ...prev[index],
                error: 'Failed to load project',
                loading: false,
              };
              return newProjects;
            });

            return null;
          }
        });

        // 等待所有请求完成
        await Promise.allSettled(fetchPromises);
        setKey((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []); return (
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
