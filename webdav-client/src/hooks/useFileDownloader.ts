import { useState } from "react";
import { FileStat } from "webdav";
import { downloadFileInChunks } from "../services/webdav";

interface DownloadStatus {
  filename: string;
  progress: number;
  speed: number; // bytes per second
  controller?: AbortController;
}

export const useFileDownloader = (onError: (message: string) => void) => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus | null>(
    null
  );

  const cancelDownload = () => {
    if (downloadStatus?.controller) {
      downloadStatus.controller.abort();
      setDownloadStatus(null);
    }
  };

  const handleFileDownload = async (file: FileStat) => {
    try {
      const controller = new AbortController();
      let lastUpdate = Date.now();
      let lastBytes = 0;

      setDownloadStatus({
        filename: file.basename,
        progress: 0,
        speed: 0,
        controller,
      });

      const { blob } = await downloadFileInChunks(
        file.filename,
        (progress, receivedBytes) => {
          const now = Date.now();
          const timeDiff = (now - lastUpdate) / 1000; // convert to seconds
          const bytesDiff = receivedBytes - lastBytes;
          const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0;

          setDownloadStatus((prev) => ({
            ...prev!,
            progress: Math.min(progress, 100),
            speed: speed,
          }));

          lastUpdate = now;
          lastBytes = receivedBytes;
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
