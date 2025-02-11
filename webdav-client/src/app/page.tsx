"use client";

import React, { useEffect, useState } from "react";
import { FileStat } from "webdav";

import { BackButton } from "../components/BackButton";
import { PageHeader } from "../components/PageHeader";
import { FileList } from "../components/FileList";
import { useFileManager } from "../hooks/useFileManager";
import { useFileDownloader } from "../hooks/useFileDownloader";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string>("");

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

  return (
    <>
      <PageHeader
        selectedImage={selectedImage}
        error={error}
        onErrorClear={() => setError("")}
      />
      <BackButton currentPath={currentPath} onBack={handleBackClick} />
      <FileList
        files={files}
        downloadStatus={downloadStatus}
        onFileClick={handleFileClick}
      />
    </>
  );
}
