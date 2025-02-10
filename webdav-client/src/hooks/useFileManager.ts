import { useState, useEffect } from "react";
import { FileStat } from "webdav";
import { client } from "../services/webdav";

export const useFileManager = () => {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [error, setError] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");

  const getParentPath = (path: string) => {
    const decodedPath = decodeURIComponent(path);
    const parts = decodedPath.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  };

  const handleBackClick = (path: string) => {
    window.location.href = encodeURI(getParentPath(path));
  };

  const handleDirectoryClick = (filename: string) => {
    const encodedPath = encodeURIComponent(filename).replace(/%2F/g, "/");
    window.location.href = encodedPath;
  };

  useEffect(() => {
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
  }, [currentPath]);

  return {
    files,
    error,
    setError,
    currentPath,
    handleBackClick,
    handleDirectoryClick,
  };
};
