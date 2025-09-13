import React from 'react';
import configData from '../configs/config.json';

// 根据熟练程度计算边框颜色 (绿-蓝-紫配色)
const getProficiencyBorderColor = (
  proficiency: number,
  isDark: boolean = false
): string => {
  // 绿色(120°) -> 蓝色(240°) -> 紫色(280°)
  let hue: number;
  let saturation: number;
  let lightness: number;

  if (proficiency <= 0.5) {
    // 0-50%: 绿色到蓝色
    hue = 120 + proficiency * 2 * 120; // 120° -> 240°
    saturation = 70 + proficiency * 20; // 70% -> 90%
  } else {
    // 50-100%: 蓝色到紫色
    hue = 240 + (proficiency - 0.5) * 2 * 40; // 240° -> 280°
    saturation = 85 + (proficiency - 0.5) * 15; // 85% -> 100%
  }

  lightness = 35 + proficiency * 25;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// 检测当前主题模式
const isDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
  return false;
};

const checkUrl = (url: string, timeout = 1000): Promise<boolean> =>
  new Promise((resolve) => {
    let timer: number | undefined = window.setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeout);

    const img = new Image();
    const cleanup = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      img.onload = null;
      img.onerror = null;
      // stop further loading
      img.src = '';
    };

    img.onload = () => {
      cleanup();
      resolve(true);
    };
    img.onerror = () => {
      cleanup();
      resolve(false);
    };

    // cache-bust to avoid cached responses
    img.src = `${url}?_=${Date.now()}`;
  });

export const TechStackSection: React.FC = () => {
  const techStackEntries = Object.entries(configData.techStack);
  const [loadingTech, setLoadingTech] = React.useState<string | null>(null);

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
            const query = encodeURIComponent(String(tech));
            const googleSearch = `https://www.google.com/search?q=${query}`;
            const bingSearch = `https://cn.bing.com/search?q=${query}&ensearch=1`;
            const pingGoogle = 'https://www.google.com/favicon.ico';
            const isLoading = loadingTech === tech;

            return (
              <a
                key={index}
                className={`tech-badge ${
                  isLoading ? 'tech-badge-loading' : ''
                }`}
                style={{
                  borderColor: getProficiencyBorderColor(
                    Number(proficiency),
                    isDarkMode()
                  ),
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  display: 'inline-block',
                  textDecoration: 'none',
                  cursor: isLoading ? 'wait' : 'pointer',
                }}
                title={`${tech}: ${Math.round(
                  Number(proficiency) * 100
                )}% - Click to search`}
                href=""
                onClick={async (e) => {
                  e.preventDefault();
                  setLoadingTech(tech);

                  try {
                    // 只 ping Google；若 Google 不可用直接打开 Bing
                    const googleAvailable = await checkUrl(pingGoogle, 1000);
                    if (googleAvailable) {
                      window.open(googleSearch, '_blank', 'noopener');
                    } else {
                      // Google 不可用则直接打开 Bing
                      window.open(bingSearch, '_blank', 'noopener');
                    }
                  } finally {
                    setLoadingTech(null);
                  }
                }}
                onAuxClick={(e) => {
                  e.preventDefault();
                  const mouseEvent = e as React.MouseEvent;
                  if (mouseEvent.button === 1) {
                    window.open(googleSearch, '_blank', 'noopener');
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                role="button"
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
