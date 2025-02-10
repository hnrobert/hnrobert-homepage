import React, { useEffect, useState } from "react";
import { FileStat } from "webdav";
import { client, downloadFile } from "./services/webdav";
import { FileItem } from "./components/FileItem";

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
    const parts = path.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
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

    const path = window.location.pathname || "/";
    setCurrentPath(path);

    const getFiles = async () => {
      try {
        const isAvailable = await client.exists("/").catch(() => false);
        if (!isAvailable) {
          throw new Error(`Directory "${path}" not found`);
        }

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
      window.location.href = file.filename;
      return;
    }

    try {
      const { response, controller } = await downloadFile(
        file.filename,
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

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <img
            src={selectedImage}
            alt="Title"
            className="w-auto max-w-[600px] min-w-[300px]"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Back Button - Only show if not in root directory */}
        {currentPath !== "/" && (
          <div className="mb-4">
            <button
              onClick={() =>
                (window.location.href = getParentPath(currentPath))
              }
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Parent Directory</span>
            </button>
          </div>
        )}

        {/* Folders Section */}
        <div className="mb-8">
          {separateFilesAndFolders(files).folders.map((folder) => (
            <FileItem
              key={folder.filename}
              file={folder}
              downloadStatus={downloadStatus}
              onFileClick={handleFileClick}
              onCancelDownload={() => downloadStatus?.controller?.abort()}
              displayStyle="row"
            />
          ))}
        </div>

        {/* Separator */}
        {separateFilesAndFolders(files).folders.length > 0 &&
          separateFilesAndFolders(files).files.length > 0 && (
            <div className="border-b border-gray-200 mb-8"></div>
          )}

        {/* Files Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {separateFilesAndFolders(files).files.map((file) => (
            <FileItem
              key={file.filename}
              file={file}
              downloadStatus={downloadStatus}
              onFileClick={handleFileClick}
              onCancelDownload={() => downloadStatus?.controller?.abort()}
              displayStyle="grid"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
