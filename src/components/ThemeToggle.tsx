"use client";

import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <div className="theme-toggle-icon">
        {theme === 'light' ? <FaSun size={18} /> : <FaMoon size={18} />}
      </div>
    </button>
  );
};
