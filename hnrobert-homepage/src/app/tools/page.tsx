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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="page-title">Useful Tools</h1>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiSearch className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {tool.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-800 rounded-full font-medium backdrop-blur-sm border border-blue-200/40">
                    {tool.category}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <div className="glass-card-subtle p-8 max-w-md mx-auto">
              <p className="text-lg">No tools found matching your search.</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
