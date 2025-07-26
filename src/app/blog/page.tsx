"use client";

import React from "react";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function BlogPage() {
  return (
    <div className="page-layout">
      <Navigation />
      <main className="main-container">
        <div className="glass-card blog-placeholder">
          <h1 className="page-title">Blog</h1>
          <p className="blog-placeholder-text">
            Coming soon... Stay tuned for my latest thoughts and tutorials!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
