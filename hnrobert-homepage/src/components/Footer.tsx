import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";

export const Footer: React.FC = () => {
  const iconSize = 20;

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* ICP info */}
        <div className="text-center text-gray-500 mb-4">
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
            className="footer-link"
          >
            <FaGithub size={iconSize} />
            HNRobert
          </a>
          <a
            href="https://space.bilibili.com/523023049"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <img
              src="/assets/bilibili.ico"
              alt="Bilibili"
              width={iconSize}
              height={iconSize}
              style={{ objectFit: "contain" }}
            />
            HNRobert
          </a>
          <a href="mailto:hnrobert@qq.com" className="footer-link">
            <img
              src="/assets/qqmail.png"
              alt="Email"
              width={iconSize}
              height={iconSize}
              style={{ objectFit: "contain" }}
            />
            hnrobert@qq.com
          </a>
        </div>

        {/* Tech Stack */}
        <div className="footer-tech">
          <span className="text-sm">Powered by:</span>
          <div className="footer-tech-item">
            <FaReact size={iconSize} style={{ color: "#29bee8" }} />
            React
          </div>
          <div className="footer-tech-item">
            <img
              src="/assets/webdav.jpg"
              alt="WebDAV"
              width={iconSize}
              height={iconSize}
              style={{ objectFit: "contain" }}
            />
            WebDAV
          </div>
        </div>
      </div>
    </footer>
  );
};
