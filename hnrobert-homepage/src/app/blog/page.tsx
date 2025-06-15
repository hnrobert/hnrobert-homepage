"use client";

import React from "react";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="glass-card p-8 text-center">
          <h1 className="page-title">Blog</h1>
          <p className="text-gray-600">
            Coming soon... Stay tuned for my latest thoughts and tutorials!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
