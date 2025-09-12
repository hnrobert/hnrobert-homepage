import React from 'react';
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

            return (
              <a
                key={index}
                className="tech-badge"
                style={{
                  borderColor: getProficiencyBorderColor(Number(proficiency)),
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  display: 'inline-block',
                  textDecoration: 'none',
                }}
                // 显示在常规 tooltip（靠近元素），并避免默认 hover 状态栏显示为 Bing 链接
                title={`Search ${tech} on Search Engine`}
                href=''
                onClick={async (e) => {
                  e.preventDefault();
                  // 只 ping Google；若 Google 不可用直接打开 Bing（不再 ping Bing）
                  const googleAvailable = await checkUrl(pingGoogle, 1000);
                  if (googleAvailable) {
                    window.open(googleSearch, '_blank', 'noopener');
                    return;
                  }
                  // Google 不可用则直接打开 Bing
                  window.open(bingSearch, '_blank', 'noopener');
                }}
                // 支持键盘与无 JS 的场景：保留 href 为 Google 搜索（当 JS 被禁用时可以直接跳转）
                onAuxClick={(e) => {
                  // 处理中键等，防止默认锚点行为并在新标签打开（中键）
                  // 注意：不同浏览器对中键行为略有差异，这里尝试兼容处理
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
