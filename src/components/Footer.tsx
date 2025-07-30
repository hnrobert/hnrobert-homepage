import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";
import { SiBilibili, SiTencentqq, SiNextdotjs } from "react-icons/si";
import { useTheme } from "../contexts/ThemeContext";

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const iconSize = 20;
  const iconContainerClass = "footer-icon-container";

  // 根据主题调整图标颜色
  const getIconColor = (lightColor: string, darkColor: string = "#ffffff") => {
    return theme === "dark" ? darkColor : lightColor;
  };

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
              <FaGithub size={iconSize} color={getIconColor("#000")} />
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
          <a href="mailto:hnrobert@qq.com" className="footer-link group">
            <div className={iconContainerClass}>
              <SiTencentqq size={iconSize} color="#3b82f6" />
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
          <div className="footer-tech-item group">
            <div className={iconContainerClass}>
              <SiNextdotjs size={iconSize} color={getIconColor("#000")} />
            </div>
            Next.js
          </div>
        </div>
      </div>
    </footer>
  );
};
