import React, { useEffect, useState } from "react";
import { FileStat } from "webdav";
import { client, downloadFile } from "./services/webdav";
import { BackButton } from "./components/BackButton";
import { PageHeader } from "./components/PageHeader";
import { FileList } from "./components/FileList";

function App() {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [downloadStatus, setDownloadStatus] = useState<{
    filename: string;
    progress: number;
    controller?: AbortController;
  } | null>(null);

  const separateFilesAndFolders = (items: FileStat[]) => {
    const folders = items.filter((item) => item.type === "directory");
    const files = items.filter((item) => item.type !== "directory");
    return { folders, files };
  };

  const getParentPath = (path: string) => {
    const decodedPath = decodeURIComponent(path);
    const parts = decodedPath.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  };

  const handleBackClick = (path: string) => {
    window.location.href = encodeURI(getParentPath(path));
  };

  useEffect(() => {
    const checkImageSize = () => {
      const width = window.innerWidth;
      setSelectedImage(
        width > 1600 ? "/assets/title-x2.png" : "/assets/title.png"
      );
    };

    checkImageSize();
    window.addEventListener("resize", checkImageSize);

    const path = decodeURIComponent(window.location.pathname) || "/";
    setCurrentPath(path);

    const getFiles = async () => {
      try {
        const directoryItems = await client.getDirectoryContents(path);
        setFiles(
          Array.isArray(directoryItems) ? directoryItems : directoryItems.data
        );
        setError("");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error fetching files:", errorMessage);
        setError(`Failed to load files: ${errorMessage}`);
        setFiles([]);
      }
    };

    getFiles();
    return () => window.removeEventListener("resize", checkImageSize);
  }, [currentPath]);

  const handleFileClick = async (file: FileStat) => {
    if (file.type === "directory") {
      const encodedPath = encodeURIComponent(file.filename).replace(
        /%2F/g,
        "/"
      );
      window.location.href = encodedPath;
      return;
    }

    try {
      const { response, controller } = await downloadFile(
        encodeURI(file.filename),
        (progress) => {
          setDownloadStatus((prev) => ({
            ...prev!,
            progress,
          }));
        }
      );

      setDownloadStatus({
        filename: file.basename,
        progress: 0,
        controller,
      });

      const contentLength = Number(response.headers.get("Content-Length")) || 0;
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const progress = (receivedLength / contentLength) * 100;
        setDownloadStatus((prev) => ({
          ...prev!,
          progress: Math.min(progress, 100),
        }));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.basename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Download cancelled");
        setError("Download cancelled");
      } else {
        console.error("Download error:", error);
        setError(`Failed to download ${file.basename}: ${error}`);
      }
    } finally {
      setDownloadStatus(null);
    }
  };

  const handleErrorClear = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          selectedImage={selectedImage}
          error={error}
          onErrorClear={handleErrorClear}
        />
        <BackButton currentPath={currentPath} onBack={handleBackClick} />
        <FileList
          files={files}
          downloadStatus={downloadStatus}
          onFileClick={handleFileClick}
        />
      </div>
    </div>
  );
}

export default App;
