'use client';

import React, { useState, Suspense, lazy } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';

const TechStackSection = lazy(() =>
  import('../components/TechStackSection').then((m) => ({
    default: m.TechStackSection,
  }))
);
const GitHubStatsSection = lazy(() =>
  import('../components/github-stats').then((m) => ({
    default: m.GitHubStatsSection,
  }))
);
const ProjectsSection = lazy(() =>
  import('../components/ProjectsSection').then((m) => ({
    default: m.ProjectsSection,
  }))
);
const HobbiesSection = lazy(() =>
  import('../components/HobbiesSection').then((m) => ({
    default: m.HobbiesSection,
  }))
);
const ContactSection = lazy(() =>
  import('../components/ContactSection').then((m) => ({
    default: m.ContactSection,
  }))
);

const SectionSkeleton = () => (
  <div className="section-skeleton">
    <div className="skeleton-animate">
      <div className="skeleton-title"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-long"></div>
        <div className="skeleton-line skeleton-line-medium"></div>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [activeSection, setActiveSection] = useState('me');

  return (
    <ParallaxProvider>
      <div className="page-layout">
        <Navigation activeSection={activeSection} />

        <main className="main-container">
          <HeroSection />

          <Suspense fallback={<SectionSkeleton />}>
            <TechStackSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <GitHubStatsSection username="hnrobert" />
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
    </ParallaxProvider>
  );
}
