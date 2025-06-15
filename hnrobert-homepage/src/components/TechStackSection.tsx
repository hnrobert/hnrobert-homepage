import { techStackData } from "../data/techStack";

export const TechStackSection: React.FC = () => {
  return (
    <section className="section">
      <div className="glass-card">
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
