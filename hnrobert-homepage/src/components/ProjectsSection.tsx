import { projectsData } from "../data/projects";

export const ProjectsSection: React.FC = () => {
  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-container">
          {projectsData.map((project, index) => (
            <div key={index} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tech">
                {project.tech.map((tech, techIndex) => (
                  <span key={techIndex} className="project-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
