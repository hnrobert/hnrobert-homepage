import configData from '../configs/config.json';

// 根据熟练程度计算边框颜色
const getProficiencyBorderColor = (proficiency: number): string => {
  if (proficiency >= 0.95) {
    // 100%熟练度使用更深的绿色
    return 'hsl(120, 100%, 25%)'; // 深绿色
  }
  // 黄色到绿色的渐变
  // 黄色: hsl(45, 100%, 50%) -> 绿色: hsl(120, 80%, 35%)
  const hue = 45 + proficiency * 75; // 45度(黄) 到 120度(绿)
  const saturation = 90 + proficiency * 10; // 90% 到 100%
  const lightness = 55 - proficiency * 20; // 55% 到 35%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const TechStackSection: React.FC = () => {
  const techStackEntries = Object.entries(configData.techStack);

  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">Tech Stack</h2>

        {/* 熟练程度指示条 */}
        <div className="proficiency-indicator">
          <div className="proficiency-gradient"></div>
          <div className="proficiency-labels">
            <span className="proficiency-label-start">Learning</span>
            <span className="proficiency-label-end">Expert</span>
          </div>
        </div>

        <div className="tech-badges">
          {techStackEntries.map(([tech, proficiency], index) => {
            const href = `https://www.google.com/search?q=${encodeURIComponent(
              tech
            )}`;
            return (
                <a
                key={index}
                className="tech-badge"
                style={{
                  borderColor: getProficiencyBorderColor(proficiency),
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
                title={tech}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                >
                {tech}
                </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
