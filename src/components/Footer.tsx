import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";
import { SiBilibili, SiTencentqq, SiNextdotjs, SiStrava } from "react-icons/si";

export const Footer: React.FC = () => {
  const iconSize = 20;
  const iconContainerClass = "footer-icon-container";

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* ICP info */}
        <div className="footer-icp">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            浙ICP备2024118372号-1
          </a>
        </div>

        {/* Social links */}
        <div className="footer-links">
          <a
            href="https://github.com/HNRobert"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link group"
          >
            <div className={iconContainerClass}>
              <FaGithub size={iconSize} color="#000" />
            </div>
            HNRobert
          </a>
          <a
            href="https://space.bilibili.com/523023049"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link group"
          >
            <div className={iconContainerClass}>
              <SiBilibili size={iconSize} color="#ff6699" />
            </div>
            HNRobert
          </a>
          <a
            href="mailto:hnrobert@qq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link group"
          >
            <div className={iconContainerClass}>
              <SiTencentqq size={iconSize} color="#3b82f6" />
            </div>
            hnrobert@qq.com
          </a>
          <a
            href="http://strava.com/athletes/hnrobert"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link group"
          >
            <div className={iconContainerClass}>
              <SiStrava size={iconSize} color="#fc4c02" />
            </div>
            Sunying - Robert He
          </a>
        </div>

        {/* Tech Stack */}
        <div className="footer-tech">
          <span className="footer-tech-label">Powered by:</span>
          <div className="footer-tech-item group">
            <div className={iconContainerClass}>
              <FaReact size={iconSize} style={{ color: "#29bee8" }} />
            </div>
            React
          </div>
          <div className="footer-tech-item group">
            <div className={iconContainerClass}>
              <SiNextdotjs size={iconSize} style={{ color: "#000" }} />
            </div>
            Next.js
          </div>
        </div>
      </div>
    </footer>
  );
};
