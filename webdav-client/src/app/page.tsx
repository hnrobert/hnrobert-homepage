"use client";

import React, { useEffect, useState } from "react";
import { FileStat } from "webdav";
import { SortType } from "../components/SortSelector";

import { NavRow } from "../components/NavRow";
import { PageHeader } from "../components/PageHeader";
import { FileList } from "../components/FileList";
import { useFileManager } from "../hooks/useFileManager";
import { useFileDownloader } from "../hooks/useFileDownloader";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [sortType, setSortType] = useState<SortType>("name");

  const {
    files,
    error,
    setError,
    currentPath,
    handleBackClick,
    handleDirectoryClick,
  } = useFileManager();

  const { downloadStatus, handleFileDownload } = useFileDownloader(setError);

  useEffect(() => {
    const checkImageSize = () => {
      const width = window.innerWidth;
      setSelectedImage(
        width > 1600 ? "/assets/title-x2.png" : "/assets/title.png"
      );
    };

    checkImageSize();
    window.addEventListener("resize", checkImageSize);
    return () => window.removeEventListener("resize", checkImageSize);
  }, []);

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

  return (
    <>
      <PageHeader
        selectedImage={selectedImage}
        error={error}
        onErrorClear={() => setError("")}
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
        sortType={sortType}
      />
    </>
  );
}
