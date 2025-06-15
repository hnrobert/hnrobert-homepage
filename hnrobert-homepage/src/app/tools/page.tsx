"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const tools = [
    {
      title: "JSON Formatter",
      description: "Format and validate JSON data",
      category: "Development",
    },
    {
      title: "Color Picker",
      description: "Pick colors and get hex, rgb values",
      category: "Design",
    },
    {
      title: "Base64 Encoder/Decoder",
      description: "Encode and decode Base64 strings",
      category: "Utilities",
    },
    {
      title: "QR Code Generator",
      description: "Generate QR codes for any text or URL",
      category: "Utilities",
    },
  ];

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-layout">
      <Navigation />

      <main className="main-container">
        <div className="page-header">
          <h1 className="page-title">Useful Tools</h1>
          <div className="search-container">
            <HiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="tools-grid">
          {filteredTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-content">
                <div className="tool-header">
                  <h3 className="tool-title">{tool.title}</h3>
                  <span className="tool-category">{tool.category}</span>
                </div>
                <p className="tool-description">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="no-results">
            <div className="no-results-card">
              <p className="no-results-text">
                No tools found matching your search.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
