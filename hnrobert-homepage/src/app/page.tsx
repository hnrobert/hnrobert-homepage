"use client";

import React, { useEffect, useState, useRef } from "react";
import { FileStat } from "webdav";
import { SortType } from "../components/SortSelector";

import { NavRow } from "../components/NavRow";
import { PageHeader } from "../components/PageHeader";
import { FileList } from "../components/FileList";
import { useFileManager } from "../hooks/useFileManager";
import { useFileDownloader } from "../hooks/useFileDownloader";
import { Footer } from "../components/Footer";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [sortType, setSortType] = useState<SortType>("name");
  const contentRef = useRef<HTMLDivElement>(null);
  const [bottomSpacing, setBottomSpacing] = useState<string>("0px");

  const {
    files,
    error,
    setError,
    currentPath,
    handleBackClick,
    handleDirectoryClick,
  } = useFileManager();

  const { downloadStatus, handleFileDownload, cancelDownload } =
    useFileDownloader(setError);

  useEffect(() => {
    const checkImageSize = () => {
      const width = window.innerWidth;
      setSelectedImage(
        width > 400 ? "/assets/title-x2.png" : "/assets/title.png"
      );
    };

    checkImageSize();
    window.addEventListener("resize", checkImageSize);
    return () => window.removeEventListener("resize", checkImageSize);
  }, []);

  useEffect(() => {
    const calculateSpacing = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.getBoundingClientRect().height;
        const viewportHeight = window.innerHeight;
        const contentVhPercentage = (contentHeight / viewportHeight) * 100;

        const spacingVh = Math.max(30, 100 - contentVhPercentage);
        setBottomSpacing(`${spacingVh}vh`);
      }
    };

    calculateSpacing();
    window.addEventListener("resize", calculateSpacing);

    const observer = new MutationObserver(calculateSpacing);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", calculateSpacing);
      observer.disconnect();
    };
  }, [files]);

  const handleFileClick = async (file: FileStat) => {
    if (file.type === "directory") {
      handleDirectoryClick(file.filename);
      return;
    }
    await handleFileDownload(file);
  };

  const handleNavigate = (path: string) => {
    handleDirectoryClick(path);
  };

  const handleNavigateHome = () => {
    handleDirectoryClick("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        ref={contentRef}
        className="flex-grow px-4"
        style={{ marginBottom: bottomSpacing }}
      >
        <PageHeader
          selectedImage={selectedImage}
          error={error}
          onErrorClear={() => setError("")}
          onNavigateHome={handleNavigateHome}
        />
        <NavRow
          currentPath={currentPath}
          onBack={handleBackClick}
          onNavigate={handleNavigate}
          sortType={sortType}
          onSortChange={setSortType}
        />
        <FileList
          files={files}
          downloadStatus={downloadStatus}
          onFileClick={handleFileClick}
          onCancelDownload={cancelDownload}
          sortType={sortType}
        />
      </div>
      <Footer />
    </div>
  );
}
