import React from "react";
import { FaGithub, FaReact } from "react-icons/fa";

export const Footer: React.FC = () => {
  const iconSize = 20;
  const iconContainerClass =
    "transition-transform duration-700 group-hover:rotate-360";

  return (
    <footer className="w-full py-8 px-4 border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ICP info */}
        <div className="text-center text-gray-500 mb-4">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800"
          >
            浙ICP备2024118372号-1
          </a>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-6 text-gray-600">
          <a
            href="https://github.com/HNRobert"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:text-gray-900"
          >
            <span className={iconContainerClass}>
              <FaGithub size={iconSize} />
            </span>
            GitHub: HNRobert
          </a>
          <a
            href="https://space.bilibili.com/523023049"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 hover:text-gray-900"
          >
            <span className={iconContainerClass}>
              <img
                src="/assets/bilibili.ico"
                alt="Bilibili"
                width={iconSize}
                height={iconSize}
                className="object-contain"
              />
            </span>
            Bilibili: HNRobert
          </a>
          <a
            href="mailto:hnrobert@qq.com"
            className="group flex items-center gap-2 hover:text-gray-900"
          >
            <span className={iconContainerClass}>
              <img
                src="/assets/qqmail.png"
                alt="Email"
                width={iconSize}
                height={iconSize}
                className="object-contain"
              />
            </span>
            HNRobert@qq.com
          </a>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-600">
          <span className="text-sm flex items-center">Powered by:</span>
          <div className="flex gap-4">
            <span className="group flex items-center gap-1">
              <span className={iconContainerClass}>
                <FaReact size={iconSize} className="text-[#29bee8]" />
              </span>
              React
            </span>
            <span className="group flex items-center gap-1">
              <span className={iconContainerClass}>
                <img
                  src="/assets/tailwind.png"
                  alt="Tailwind CSS"
                  width={iconSize}
                  height={iconSize}
                  className="object-contain"
                />
              </span>
              Tailwind CSS
            </span>
            <span className="group flex items-center gap-1">
              <span className={iconContainerClass}>
                <img
                  src="/assets/webdav.jpg"
                  alt="WebDAV"
                  width={iconSize}
                  height={iconSize}
                  className="object-contain"
                />
              </span>
              WebDAV
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
