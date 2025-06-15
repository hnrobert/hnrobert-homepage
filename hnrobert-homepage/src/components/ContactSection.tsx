import {
  SiGithub,
  SiDiscord,
  SiBilibili,
  SiTencentqq,
  SiWechat,
} from "react-icons/si";

export const ContactSection: React.FC = () => {
  return (
    <section className="mb-20">
      <div className="glass-card p-10">
        <h2 className="section-title">Contact</h2>
        <div className="contact-grid">
          <a href="mailto:hnrobert@qq.com" className="contact-item">
            <SiTencentqq
              className="contact-icon"
              style={{ color: "#3b82f6" }}
            />
            <span className="text-sm font-medium">hnrobert@qq.com</span>
          </a>
          <div className="contact-item">
            <SiWechat className="contact-icon" style={{ color: "#22c55e" }} />
            <span className="text-sm font-medium">HNRobert</span>
          </div>
          <div className="contact-item">
            <SiDiscord className="contact-icon" style={{ color: "#6366f1" }} />
            <span className="text-sm font-medium">hnrobert</span>
          </div>
          <a
            href="https://space.bilibili.com/523023049"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <SiBilibili className="contact-icon" style={{ color: "#ec4899" }} />
            <span className="text-sm font-medium">HNRobert</span>
          </a>
          <a
            href="https://github.com/HNRobert"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
            style={{ gridColumn: "span 2" }}
          >
            <SiGithub className="contact-icon" style={{ color: "#1f2937" }} />
            <span className="text-sm font-medium">github.com/HNRobert</span>
          </a>
        </div>
      </div>
    </section>
  );
};
