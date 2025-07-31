"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark"); // 默认深色模式
  const [isClient, setIsClient] = useState(false);

  // 客户端挂载时获取已经设置的主题
  useEffect(() => {
    setIsClient(true);

    // 从DOM中读取当前主题（已经在HTML头部设置）
    const currentTheme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTheme(currentTheme);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (!isClient) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置主题时才跟随系统变化
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [isClient]);

  // 应用主题到DOM
  useEffect(() => {
    if (!isClient) return;

    const root = document.documentElement;

    // 移除所有主题类
    root.classList.remove("light", "dark");
    // 添加当前主题类
    root.classList.add(theme);

    // 清除内联样式，让CSS变量接管
    root.style.backgroundColor = "";
    root.style.color = "";

    // 启用过渡效果
    root.classList.add("theme-loaded");

    // 保存到本地存储
    localStorage.setItem("theme", theme);
  }, [isClient, theme]);

  const toggleTheme = () => {
    // 启用手动切换的过渡效果
    const root = document.documentElement;
    root.classList.add("theme-manual-change");

    setTheme((current) => (current === "light" ? "dark" : "light"));

    // 移除手动切换标记
    setTimeout(() => {
      root.classList.remove("theme-manual-change");
    }, 300);
  };

  const handleSetTheme = (newTheme: Theme) => {
    // 启用手动切换的过渡效果
    const root = document.documentElement;
    root.classList.add("theme-manual-change");

    setTheme(newTheme);

    // 移除手动切换标记
    setTimeout(() => {
      root.classList.remove("theme-manual-change");
    }, 300);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
