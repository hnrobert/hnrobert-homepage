"use client";

import React, { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import { type WebProject } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectsListProps {
  projects: WebProject[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // 标记客户端已挂载
    setIsClient(true);

    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    // 初始检查
    checkMobile();

    // 监听窗口大小变化
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px 0% 0px", // 元素进入时触发
      threshold: 0, // 元素至少 0% 可见时触发
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const projectId = entry.target.getAttribute("data-project-id");
        if (projectId) {
          if (entry.isIntersecting) {
            setVisibleProjects((prev) => new Set(prev).add(projectId));
          }
        }
      });
    }, observerOptions);

    // 观察所有项目卡片
    const projectElements = document.querySelectorAll("[data-project-id]");
    projectElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [isClient, projects]);

  // 渲染移动端项目的通用函数
  const renderMobileProjects = (projectsList: WebProject[]) => {
    return (
      <div className="projects-container-mobile">
        {projectsList.map((project, index) => {
          return (
            <div
              key={project.id}
              data-project-id={project.id}
              style={{
                width: "100%",
                marginBottom: "0.8rem",
              }}
            >
              <Parallax
                translateX={index % 2 === 0 ? [-120, 0] : [120, 0]}
                opacity={[0, 1]}
                easing={[0.5, 1, 0, 1]}
                speed={-3}
                shouldAlwaysCompleteAnimation={true}
                style={{
                  width: "100%",
                }}
              >
                <div className="project-card-wrapper-mobile">
                  <ProjectCard project={project} />
                </div>
              </Parallax>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染桌面端项目的通用函数
  const renderDesktopProjects = (projectsList: WebProject[]) => {
    const projectPairs = [];
    for (let i = 0; i < projectsList.length; i += 2) {
      projectPairs.push(projectsList.slice(i, i + 2));
    }

    return (
      <div className="projects-container-desktop">
        {projectPairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="project-pair">
            {pair.map((project, index) => {
              return (
                <div
                  key={project.id}
                  data-project-id={project.id}
                  style={{
                    flex: 1,
                    maxWidth: "calc(50% - 1rem)",
                  }}
                >
                  <Parallax
                    translateX={index === 0 ? [-150, 0] : [150, 0]}
                    opacity={[0, 1]}
                    easing={[0.5, 1, 0, 1]}
                    speed={-3}
                    shouldAlwaysCompleteAnimation={true}
                    style={{
                      width: "100%",
                    }}
                  >
                    <div className="project-card-wrapper-desktop">
                      <ProjectCard project={project} />
                    </div>
                  </Parallax>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // 在客户端挂载之前，使用默认布局避免 hydration 错误
  if (!isClient || isMobile === null) {
    // 在加载状态下也使用 Parallax 效果，但不依赖 intersection observer
    // 默认假设为桌面端，客户端挂载后会自动切换到正确的布局
    renderDesktopProjects(projects);
  }

  if (isMobile) {
    // 移动端：一行一个项目，奇数从左侧移入，偶数从右侧移入
    return renderMobileProjects(projects);
  }

  // 桌面端：一行两列，成对从两侧移入
  return renderDesktopProjects(projects);
};
