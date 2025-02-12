import { useState } from "react";
import { FileStat } from "webdav";
import { downloadFileInChunks } from "../services/webdav";

export const useFileDownloader = (onError: (message: string) => void) => {
  const [downloadStatus, setDownloadStatus] = useState<{
    filename: string;
    progress: number;
    controller?: AbortController;
  } | null>(null);

  const cancelDownload = () => {
    if (downloadStatus?.controller) {
      downloadStatus.controller.abort();
      setDownloadStatus(null);
    }
  };

  const handleFileDownload = async (file: FileStat) => {
    try {
      const controller = new AbortController();
      setDownloadStatus({
        filename: file.basename,
        progress: 0,
        controller,
      });

      const { blob } = await downloadFileInChunks(
        file.filename,
        (progress) => {
          setDownloadStatus((prev) => ({
            ...prev!,
            progress: Math.min(progress, 100),
          }));
        },
        controller
      );

      setDownloadStatus((prev) => ({
        ...prev!,
        controller,
      }));

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.basename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Download cancelled");
          onError("Download cancelled");
        } else {
          console.error("Download error details:", {
            error: error.message,
            name: error.name,
            stack: error.stack,
          });
          onError(`Failed to download ${file.basename}: ${error.message}`);
        }
      } else {
        console.error("Unknown download error:", error);
        onError(`Failed to download ${file.basename}: Unknown error`);
      }
    } finally {
      setDownloadStatus(null);
    }
  };

  return {
    downloadStatus,
    handleFileDownload,
    cancelDownload,
  };
};
