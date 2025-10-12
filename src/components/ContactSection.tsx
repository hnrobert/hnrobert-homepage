import {
  SiGithub,
  SiStrava,
  SiDiscord,
  SiBilibili,
  SiTencentqq,
  SiWechat,
} from "react-icons/si";
import { useTheme } from "../contexts/ThemeContext";

export const ContactSection: React.FC = () => {
  const { theme } = useTheme();

  // 根据主题调整GitHub图标颜色
  const getGithubIconColor = () => {
    return theme === "dark" ? "#ffffff" : "#1f2937";
  };
  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">Contact</h2>
        <div className="contact-grid">
          <a href="mailto:hnrobert@qq.com" className="contact-item">
            <SiTencentqq
              className="contact-icon"
              style={{ color: "#3b82f6" }}
            />
            <span className="contact-label">hnrobert@qq.com</span>
          </a>
          <div className="contact-item">
            <SiWechat className="contact-icon" style={{ color: "#22c55e" }} />
            <span className="contact-label">HNRobert</span>
          </div>
          <a
            href="https://discord.gg/5dVbWhEbQc"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <SiDiscord className="contact-icon" style={{ color: "#6366f1" }} />
            <span className="contact-label">hnrobert</span>
          </a>
          <a
            href="https://space.bilibili.com/523023049"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <SiBilibili className="contact-icon" style={{ color: "#ff6699" }} />
            <span className="contact-label">HNRobert</span>
          </a>
          <a
            href="https://github.com/hnrobert"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item contact-item-span"
          >
            <SiGithub
              className="contact-icon"
              style={{ color: getGithubIconColor() }}
            />
            <span className="contact-label">hnrobert</span>
          </a>
          <a
            href="http://strava.com/athletes/hnrobert"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item contact-item-span"
          >
            <SiStrava className="contact-icon" style={{ color: "#fc4c02" }} />
            <span className="contact-label">Sunying - Robert He</span>
          </a>
        </div>
      </div>
    </section>
  );
};
