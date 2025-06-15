import { techStackData } from "../data/techStack";

export const TechStackSection: React.FC = () => {
  return (
    <section className="mb-20">
      <div className="glass-card p-10">
        <h2 className="section-title">Tech Stack</h2>
        <div className="tech-badges">
          {techStackData.map((tech, index) => (
            <span key={index} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
