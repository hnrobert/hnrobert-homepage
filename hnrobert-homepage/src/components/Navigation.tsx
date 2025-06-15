"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  activeSection?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && activeSection === "me") return true;
    return pathname === path;
  };

  return (
    <nav className="glass-nav">
      <div className="container nav-container">
        <Link href="/" className="nav-brand">
          <div className="nav-logo">H</div>
          <span className="nav-title">HNRobert</span>
        </Link>

        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Me
          </Link>
          <Link
            href="/blog"
            className={`nav-link ${isActive("/blog") ? "active" : ""}`}
          >
            Blog
          </Link>
          <Link
            href="/tools"
            className={`nav-link ${isActive("/tools") ? "active" : ""}`}
          >
            Tools
          </Link>
          <Link
            href="/files"
            className={`nav-link ${isActive("/files") ? "active" : ""}`}
          >
            Files
          </Link>
        </div>
      </div>
    </nav>
  );
};
