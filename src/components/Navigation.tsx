"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavigationProps {
  activeSection?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && activeSection === "me") return true;
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="glass-nav">
      <div className="container nav-container">
        {/* 移动端菜单按钮 */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? "active" : ""}`}
          ></span>
        </button>

        <Link href="/" className="nav-brand" onClick={closeMobileMenu}>
          <div className="nav-logo">
            <img src="/assets/avt.jpg" alt="HNRobert" className="nav-avatar" />
          </div>
          <span className="nav-title">HNRobert</span>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Me
          </Link>
          <Link
            href="/blog"
            className={`nav-link ${isActive("/blog") ? "active" : ""}`}
          >
            Blog
          </Link>
          {/* 
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
          */}
        </div>

        {/* Theme Toggle - 保持在右侧 */}
        <ThemeToggle />
      </div>
    </nav>
  );
};
