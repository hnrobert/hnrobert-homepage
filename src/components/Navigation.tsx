"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
        <Link href="/" className="nav-brand" onClick={closeMobileMenu}>
          <div className="nav-logo">
            <img src="/assets/avt.jpg" alt="HNRobert" className="nav-avatar" />
          </div>
          <span className="nav-title">HNRobert</span>
        </Link>

        {/* 移动端菜单按钮 */}
        <button 
          className="mobile-menu-toggle md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            Me
          </Link>
          {/* 其他导航链接可以在这里添加 */}
        </div>
      </div>
    </nav>
  );
};
