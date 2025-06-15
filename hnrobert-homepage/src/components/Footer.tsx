import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";
import { SiGithub, SiBilibili, SiTencentqq } from "react-icons/si";

export const Footer: React.FC = () => {
  const iconSize = 20;
  const iconContainerClass =
    "transition-transform duration-700 group-hover:rotate-360";

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
              <FaGithub size={iconSize} />
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
              <SiBilibili size={iconSize} />
            </div>
            HNRobert
          </a>
          <a href="mailto:hnrobert@qq.com" className="footer-link group">
            <div className={iconContainerClass}>
              <SiTencentqq size={iconSize} />
            </div>
            hnrobert@qq.com
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
        </div>
      </div>
    </footer>
  );
};
