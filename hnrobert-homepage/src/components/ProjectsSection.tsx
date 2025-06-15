import { projectsData } from "../data/projects";

export const ProjectsSection: React.FC = () => {
  return (
    <section className="mb-20">
      <div className="glass-card p-10">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-container">
          {projectsData.map((project, index) => (
            <div key={index} className="project-card">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {project.description}
              </p>
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
