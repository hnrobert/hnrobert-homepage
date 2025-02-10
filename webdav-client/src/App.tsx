import React, { useEffect, useState, useRef } from "react";
import { createClient, FileStat } from "webdav";

// Add this utility function before the App component
const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const client = createClient("http://192.168.50.146:9970", {
  username: "robert",
  password: "060610",
});

interface DownloadStatus {
  filename: string;
  progress: number;
  controller?: AbortController;
}

function App() {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [downloading, setDownloading] = useState<string>("");
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(
    null
  );

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
        // Test connection first
        console.log("Checking connection...");
        console.log(path);
        const isAvailable = await client.exists("/").catch(() => false);

        if (!isAvailable) {
          throw new Error(`Directory "${path}" not found`);
        }

        const directoryItems = await client.getDirectoryContents(path);
        setFiles(
          Array.isArray(directoryItems) ? directoryItems : directoryItems.data
        );
        setError(""); // Clear any previous errors
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
      const controller = new AbortController();
      setDownloadStatus({
        filename: file.basename,
        progress: 0,
        controller,
      });

      const credentials = btoa("robert:060610");
      const response = await fetch(
        `http://192.168.50.146:9970${file.filename}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
          signal: controller.signal,
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const contentLength = Number(response.headers.get("Content-Length")) || 0;
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        // Update progress
        const progress = (receivedLength / contentLength) * 100;
        setDownloadStatus((prev) => ({
          ...prev!,
          progress: Math.min(progress, 100),
        }));
      }

      // Concatenate chunks
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

  const handleCancelDownload = () => {
    if (downloadStatus?.controller) {
      downloadStatus.controller.abort();
    }
  };

  const FileIcon = ({ isDirectory }: { isDirectory: boolean }) => (
    <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isDirectory ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      )}
    </svg>
  );

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.filename}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              onClick={() => !downloadStatus && handleFileClick(file)}
              style={{
                cursor: downloadStatus ? "default" : "pointer",
                opacity:
                  downloadStatus && downloadStatus.filename !== file.basename
                    ? 0.7
                    : 1,
                pointerEvents:
                  downloadStatus && downloadStatus.filename !== file.basename
                    ? "none"
                    : "auto",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileIcon isDirectory={file.type === "directory"} />
                  <span className="text-gray-700 truncate hover:text-blue-600">
                    {file.basename}
                  </span>
                </div>
                {downloadStatus?.filename === file.basename && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelDownload();
                    }}
                    className="px-2 py-1 text-sm text-red-600 hover:text-red-800 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {file.type !== "directory" && (
                <div className="mt-2 text-sm text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>Size: {formatFileSize(file.size)}</span>
                    {downloadStatus?.filename === file.basename && (
                      <span className="text-blue-500">
                        {downloadStatus.progress.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {downloadStatus?.filename === file.basename && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${downloadStatus.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
