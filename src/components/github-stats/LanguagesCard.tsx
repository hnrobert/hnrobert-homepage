'use client';

import React from 'react';

interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
}

interface LanguagesCardProps {
  languages: LanguageStats[];
}

// 获取语言对应的颜色
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95',
    Ruby: '#701516',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Shell: '#89e051',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
    SQL: '#e38c00',
  };

  return colors[language] || '#586069';
}

export const LanguagesCard: React.FC<LanguagesCardProps> = ({ languages }) => {
  return (
    <div className="languages-section">
      <h3 className="languages-title">Most Used Languages</h3>
      <div className="languages-grid">
        {languages.map((lang, index) => (
          <div key={lang.language} className="language-item">
            <div className="language-info">
              <div
                className="language-color"
                style={{ backgroundColor: getLanguageColor(lang.language) }}
              ></div>
              <span className="language-name">{lang.language}</span>
              <span className="language-percentage">{lang.percentage}%</span>
            </div>
            <div className="language-bar">
              <div
                className="language-progress"
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: getLanguageColor(lang.language),
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
