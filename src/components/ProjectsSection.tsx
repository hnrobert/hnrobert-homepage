import React, { useState, useEffect, useRef } from "react";
import {
  loadProjects,
  getPlaceholderProjects,
  type WebProject,
} from "../data/projects";

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<WebProject[]>(() =>
    getPlaceholderProjects()
  );
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 水平滚动功能
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isInView =
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2;

      if (isInView && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const formatStars = (stars: number): string => {
    if (stars >= 1000) {
      return `${(stars / 1000).toFixed(1)}k`;
    }
    return stars.toString();
  };

  // 从 GitHub URL 提取仓库名
  const getRepoNameFromUrl = (url: string): string => {
    try {
      const match = url.match(/github\.com\/[^\/]+\/([^\/]+)/);
      return match ? match[1].replace(/-/g, " ") : "Repository";
    } catch {
      return "Repository";
    }
  };

  return (
    <section className="section" id="featured-projects" ref={sectionRef}>
      <div className="glass-card">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-container" ref={containerRef}>
          {projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${project.loading ? "loading" : ""}`}
            >
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

              {project.loading ? (
                <div className="project-description">
                  <div className="skeleton skeleton-description"></div>
                </div>
              ) : (
                <p className="project-description">{project.description}</p>
              )}

              {/* Error Display */}
              {project.error && !project.loading && (
                <div className="project-error">
                  <span className="error-label">⚠️ Error:</span>
                  <span className="error-text">{project.error}</span>
                </div>
              )}

              {/* Language Section */}
              {!project.loading &&
                project.language &&
                project.language !== "Unknown" && (
                  <div className="project-languages">
                    <span className="languages-label">Language:</span>
                    <span className="language-tag">{project.language}</span>
                  </div>
                )}

              {/* Languages Loading State */}
              {project.loading && (
                <div className="project-languages">
                  <span className="languages-label">Language:</span>
                  <div className="skeleton skeleton-language-tag"></div>
                </div>
              )}

              {/* Topics Section */}
              {!project.loading && project.topics.length > 0 && (
                <div className="project-tech">
                  {project.topics
                    .slice(0, 4)
                    .map((topic: string, index: number) => (
                      <span key={index} className="project-tech-tag">
                        {topic}
                      </span>
                    ))}
                  {project.topics.length > 4 && (
                    <span className="tech-more">
                      +{project.topics.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Topics Loading State */}
              {project.loading && (
                <div className="project-tech">
                  <div className="skeleton skeleton-tech-tag"></div>
                  <div className="skeleton skeleton-tech-tag"></div>
                  <div className="skeleton skeleton-tech-tag"></div>
                </div>
              )}

              {/* Project Stats */}
              <div className="project-stats">
                {project.loading ? (
                  <>
                    <div className="skeleton skeleton-stat"></div>
                    <div className="skeleton skeleton-stat"></div>
                  </>
                ) : (
                  <>
                    {project.forks > 0 && (
                      <span className="stat-item">
                        🍴 {project.forks} forks
                      </span>
                    )}
                    <span className="stat-item">
                      📅 Updated{" "}
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>

              <div className="project-actions">
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  View on GitHub →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
