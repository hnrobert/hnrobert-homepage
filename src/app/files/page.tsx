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
        return <HiDocumentText className="file-icon-red" />;
      case "image":
        return <HiPhotograph className="file-icon-green" />;
      case "video":
        return <HiFilm className="file-icon-purple" />;
      default:
        return <HiDocumentText className="file-icon-blue" />;
    }
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-layout">
      <Navigation />

      <main className="main-container">
        <div className="page-header">
          <h1 className="page-title">File Sharing</h1>
          <div className="search-container">
            <HiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="glass-card">
          <div className="files-list">
            {filteredFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-content">
                  <div className="file-info">
                    <div className="file-icon-container">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-details">
                      <h3 className="file-name">{file.name}</h3>
                      <p className="file-description">{file.description}</p>
                    </div>
                  </div>
                  <div className="file-actions">
                    <span className="file-size">{file.size}</span>
                    <a href={file.url} className="download-btn">
                      <HiDownload />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredFiles.length === 0 && (
          <div className="no-results">
            <div className="no-results-card">
              <p className="no-results-text">
                No files found matching your search.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
