"use client";

import React, { useState, Suspense, lazy } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";

// 懒加载组件
const TechStackSection = lazy(() =>
  import("../components/TechStackSection").then((m) => ({
    default: m.TechStackSection,
  }))
);
const ProjectsSection = lazy(() =>
  import("../components/ProjectsSection").then((m) => ({
    default: m.ProjectsSection,
  }))
);
const HobbiesSection = lazy(() =>
  import("../components/HobbiesSection").then((m) => ({
    default: m.HobbiesSection,
  }))
);
const ContactSection = lazy(() =>
  import("../components/ContactSection").then((m) => ({
    default: m.ContactSection,
  }))
);

// 加载占位符组件
const SectionSkeleton = () => (
  <div className="glass-card p-10 mb-20">
    <div style={{ animation: "pulse 2s infinite" }}>
      <div
        style={{
          height: "2rem",
          backgroundColor: "#e5e7eb",
          borderRadius: "4px",
          width: "33%",
          margin: "0 auto 2rem",
        }}
      ></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            height: "1rem",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            width: "75%",
          }}
        ></div>
        <div
          style={{
            height: "1rem",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            width: "50%",
          }}
        ></div>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [activeSection, setActiveSection] = useState("me");

  return (
    <div className="min-h-screen flex flex-col bg-gradient">
      <Navigation activeSection={activeSection} />

      <main className="flex-1 container px-6 py-12">
        <HeroSection />

        <Suspense fallback={<SectionSkeleton />}>
          <TechStackSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <HobbiesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
