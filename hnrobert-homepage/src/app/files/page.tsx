"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HiSearch,
  HiDownload,
  HiDocumentText,
  HiPhotograph,
  HiFilm,
} from "react-icons/hi";
import { Footer } from "../../components/Footer";
import { Navigation } from "../../components/Navigation";

export default function FilesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const files = [
    {
      name: "Resume_HNRobert_2024.pdf",
      size: "2.3 MB",
      type: "document",
      url: "#",
      description: "Latest resume and portfolio",
    },
    {
      name: "Unity_Project_Demo.zip",
      size: "45.2 MB",
      type: "archive",
      url: "#",
      description: "Unity game development sample project",
    },
    {
      name: "Coding_Tutorial_Series.mp4",
      size: "128 MB",
      type: "video",
      url: "#",
      description: "Programming tutorial video series",
    },
    {
      name: "Design_Assets_Pack.zip",
      size: "15.7 MB",
      type: "archive",
      url: "#",
      description: "UI/UX design resources and assets",
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "document":
        return <HiDocumentText className="text-red-500" />;
      case "image":
        return <HiPhotograph className="text-green-500" />;
      case "video":
        return <HiFilm className="text-purple-500" />;
      default:
        return <HiDocumentText className="text-blue-500" />;
    }
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="page-title">File Sharing</h1>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiSearch className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="glass-card p-8">
          <div className="space-y-6">
            {filteredFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center space-x-6">
                    <div className="text-3xl">{getFileIcon(file.type)}</div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {file.name}
                      </h3>
                      <p className="text-gray-600 mt-1">{file.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-sm text-gray-500 font-medium">
                      {file.size}
                    </span>
                    <a href={file.url} className="download-btn">
                      <HiDownload className="text-lg" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <div className="glass-card-subtle p-8 max-w-md mx-auto">
              <p className="text-lg">No files found matching your search.</p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
